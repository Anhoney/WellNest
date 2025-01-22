const pool = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { notifyUser } = require("./notificationController");

// Create a new collaboration request
const createCollaborationRequest = async (req, res) => {
  const { user_id, collaborator_id, relationship } = req.body;

  try {
    // Check if user_id exists in the users table
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
      user_id,
    ]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User  ID does not exist." });
    }

    // Check if collaborator_id exists in the users table
    const collaboratorCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [collaborator_id]
    );
    if (collaboratorCheck.rows.length === 0) {
      return res.status(404).json({ error: "Collaborator ID does not exist." });
    }

    // Fetch the collaborator's username from the profile table
    const collaboratorProfile = await pool.query(
      "SELECT username FROM profile WHERE user_id = $1",
      [collaborator_id]
    );

    if (collaboratorProfile.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Collaborator username not found." });
    }

    const collaboratorUsername = collaboratorProfile.rows[0].username;

    // If both IDs exist, proceed to insert the collaboration request
    const result = await pool.query(
      "INSERT INTO collaborators (user_id, collaborator_id, relationship, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [user_id, collaborator_id, relationship]
    );
    collaboration = result.rows[0];
    // Notify the user directly
    await notifyUser(
      collaboration.user_id, // Pass user ID from query result
      `You have received a collaboration request from ${collaboratorUsername} at ${collaboration.created_at}. Please manage your collaborations.`,
      "collaboration_request"
    );

    res.status(201).json({
      message: "Collaboration request created successfully!",
      collaboration: result.rows[0], // Optionally include the created collaboration request
    });
    // res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get collaboration requests for a user
const getCollaborationRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        c.*,
        CASE
          WHEN u.role = '1' THEN p.username
          WHEN u.role = '2' THEN cp.username
          WHEN u.role = '3' THEN hp.username
          WHEN u.role = '4' THEN p.username
          ELSE NULL
        END AS collaborator_username
      FROM
        collaborators c
      JOIN
        users u ON c.collaborator_id = u.id
      LEFT JOIN
        profile p ON (u.role = '1' OR u.role = '4') AND c.collaborator_id = p.user_id
      LEFT JOIN
        co_profile cp ON u.role = '2' AND c.collaborator_id = cp.user_id
      LEFT JOIN
        hp_profile hp ON u.role = '3' AND c.collaborator_id = hp.user_id
      WHERE
        c.user_id = $1 AND c.status = 'pending'
    `,
      [userId]
    );
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept a collaboration request
const acceptCollaborationRequest = async (req, res) => {
  const { collabId } = req.params;

  try {
    // Fetch the collaboration record to get the collaborator_id
    const collaborationResult = await pool.query(
      "SELECT user_id FROM collaborators WHERE collab_id = $1",
      [collabId]
    );

    if (collaborationResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Collaboration request not found." });
    }

    const collaboration = collaborationResult.rows[0];
    const user_id = collaboration.user_id;

    //Fetch the collaborator's username from the profile table
    const collaboratorProfile = await pool.query(
      "SELECT username FROM profile WHERE user_id = $1",
      [user_id]
    );

    if (collaboratorProfile.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Collaborator username not found." });
    }

    const collaboratorUsername = collaboratorProfile.rows[0].username;

    const result = await pool.query(
      "UPDATE collaborators SET status = 'accepted' WHERE collab_id = $1 RETURNING *",
      [collabId]
    );
    const updatedCollaboration = result.rows[0];

    // collaboration = result.rows[0];
    // Notify the user directly
    await notifyUser(
      updatedCollaboration.collaborator_id, // Pass user ID from query result
      `${collaboratorUsername} have accepted your collaboration request at ${updatedCollaboration.created_at}. `,
      "collaboration_accepted"
    );

    res.json(updatedCollaboration);

    // res.json(result.rows[0]);
  } catch (error) {
    console.error("Error accepting collaboration request:", error);
    res.status(500).json({ error: error.message });
  }
};

// Decline a collaboration request
const rejectCollaborationRequest = async (req, res) => {
  const { collabId } = req.params;

  try {
    // Fetch the collaboration record to get the collaborator_id
    const collaborationResult = await pool.query(
      "SELECT user_id FROM collaborators WHERE collab_id = $1",
      [collabId]
    );

    if (collaborationResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Collaboration request not found." });
    }

    const collaboration = collaborationResult.rows[0];
    const user_id = collaboration.user_id;

    //Fetch the collaborator's username from the profile table
    const collaboratorProfile = await pool.query(
      "SELECT username FROM profile WHERE user_id = $1",
      [user_id]
    );

    if (collaboratorProfile.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Collaborator username not found." });
    }

    const collaboratorUsername = collaboratorProfile.rows[0].username;

    const result = await pool.query(
      "UPDATE collaborators SET status = 'declined' WHERE collab_id = $1 RETURNING *",
      [collabId]
    );

    const updatedCollaboration = result.rows[0];

    // collaboration = result.rows[0];
    // Notify the user directly
    await notifyUser(
      updatedCollaboration.collaborator_id, // Pass user ID from query result
      `${collaboratorUsername} have rejected your collaboration request at ${updatedCollaboration.created_at}. `,
      "collaboration_declined"
    );

    // collaboration = result.rows[0];
    // // Notify the user directly
    // await notifyUser(
    //   collaboration.collaborator_id, // Pass user ID from query result
    //   ` ${collaboration.user_id} have rejected your collaboration request at ${collaboration.created_at}. `,
    //   "collaboration_rejected"
    // );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all accepted collaborations for a user
const getAllAcceptedCollaborations = async (req, res) => {
  const { userId: currentLoggedInUserId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
      c.*,
        u.full_name,
        u.role,
        CASE
          WHEN u.role = '1' THEN 'Cherish'
          WHEN u.role = '2' THEN 'Community Organizer'
          WHEN u.role = '3' THEN 'Healthcare Provider'
          WHEN u.role = '4' THEN 'Care Buddy'
          ELSE u.role
        END AS role_label,
        CASE
          WHEN u.role = '1' THEN p.username
          WHEN u.role = '2' THEN cp.username
          WHEN u.role = '3' THEN hp.username
          WHEN u.role = '4' THEN p.username
          ELSE NULL
        END AS collaborator_username
      FROM
        collaborators c
      JOIN
        users u ON 
          ($1 = c.user_id AND c.collaborator_id = u.id) OR 
          ($1 = c.collaborator_id AND c.user_id = u.id)
      LEFT JOIN
        profile p ON (u.role = '1' OR u.role = '4') AND u.id = p.user_id
      LEFT JOIN
        co_profile cp ON u.role = '2' AND u.id = cp.user_id
      LEFT JOIN
        hp_profile hp ON u.role = '3' AND u.id = hp.user_id
      WHERE
        (c.user_id = $1 OR c.collaborator_id = $1) AND c.status = 'accepted' AND u.id != $1
    `,
      [currentLoggedInUserId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user details for collaboration
const getUserDetailsForCollaboration = async (req, res) => {
  const { userToCollabId } = req.params;
  console.log(userToCollabId);
  try {
    const result = await pool.query(
      `
      SELECT 

        u.phone_no,
        CASE 
          WHEN u.role = '1' THEN p.username
          WHEN u.role = '2' THEN cp.username
          WHEN u.role = '3' THEN hp.username
          WHEN u.role = '4' THEN p.username
          ELSE NULL
        END AS username
      FROM 
        users u
      LEFT JOIN 
        profile p ON (u.role = '1' OR u.role = '4') AND u.id = p.user_id
      LEFT JOIN 
        co_profile cp ON u.role = '2' AND u.id = cp.user_id
      LEFT JOIN 
        hp_profile hp ON u.role = '3' AND u.id = hp.user_id
      WHERE 
        u.id = $1
    `,
      [userToCollabId]
    );
    console.log(result.rows);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the user details
    } else {
      res.status(404).json({ error: "User  not found." });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCaregiverInformation = async (req, res) => {
  const { caregiverId } = req.params;
  console.log("getCaregiverInformation", caregiverId);
  try {
    const result = await pool.query(
      `
      SELECT
        u.id AS user_id,
        u.full_name,
        u.phone_no AS phone_no,
        u.email,
        u.role,
        -- Profile-related fields:
         CASE
          WHEN u.role = '1' OR u.role = '4' THEN p.username
          ELSE NULL
        END AS username,
        CASE
          WHEN u.role = '1' OR u.role = '4' THEN p.age
          ELSE NULL
        END AS age,
        CASE
          WHEN u.role = '1' OR u.role = '4' THEN p.address
          ELSE NULL
        END AS address,
        CASE
          WHEN u.role = '1' OR u.role = '4' THEN p.gender
          ELSE NULL
        END AS gender,
        CASE
          WHEN u.role = '1' OR u.role = '4' THEN p.date_of_birth
          ELSE NULL
        END AS date_of_birth,
        CASE
          WHEN u.role = '1' OR u.role = '4' THEN p.core_qualifications
          ELSE NULL
        END AS core_qualifications,
        CASE
          WHEN u.role = '1' OR u.role = '4' THEN p.profile_image
          ELSE NULL
        END AS profile_image,
        CASE
          WHEN u.role = '2' THEN cp.organizer_details
          ELSE NULL
        END AS organizer_details,
        CASE
          WHEN u.role = '2' THEN cp.profile_image
          ELSE NULL
        END AS co_profile_image,
        CASE
          WHEN u.role = '3' THEN hp.specialist
          ELSE NULL
        END AS specialist,
        CASE
          WHEN u.role = '3' THEN hp.hospital
          ELSE NULL
        END AS hospital,
        CASE
          WHEN u.role = '3' THEN hp.profile_image
          ELSE NULL
        END AS hp_profile_image
      FROM
        users u
      LEFT JOIN
        profile p ON (u.role = '1' OR u.role = '4') AND u.id = p.user_id
      LEFT JOIN
        co_profile cp ON u.role = '2' AND u.id = cp.user_id
      LEFT JOIN
        hp_profile hp ON u.role = '3' AND u.id = hp.user_id
      WHERE
        u.id = $1
    `,
      [caregiverId]
    );

    let profileData;
    profileData = result.rows[0] || {};

    let profileImageBase64 = null;
    if (profileData.profile_image) {
      profileImageBase64 = `data:image/jpeg;base64,${profileData.profile_image.toString(
        "base64"
      )}`;
    }
    const data = {
      profile_image: profileImageBase64, // Send base64-encoded image
      // profile_image: profileData.profile_image
      //   ? `/uploads/${profileData.profile_image}`
      //   : null,
      ...profileData,
    };
    console.log("getCaregiverInformation", result.rows);
    if (result.rows.length > 0) {
      // res.json(result.rows[0]); // Return the user details
      res.json(data);
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a collaboration
const deleteCollaboration = async (req, res) => {
  const { collabId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM collaborators WHERE collab_id = $1 RETURNING *",
      [collabId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Collaboration not found." });
    }

    res.json({ message: "Collaboration deleted successfully." });
  } catch (error) {
    console.error("Error deleting collaboration:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get pending collaboration requests for a user
const getPendingCollaborationRequests = async (req, res) => {
  const { userId } = req.params;
  console.log("getPendingCollaborationRequests", userId);
  try {
    // const result = await pool.query(
    //   `
    //   SELECT c.*, u.full_name, p.username, hp.username AS hp_username, cp.username AS co_username
    //   FROM collaborators c
    //   JOIN users u ON c.user_id = u.id
    //   JOIN profile p ON c.user_id = p.user_id
    //   JOIN hp_profile hp ON c.user_id = hp.user_id
    //   JOIN co_profile cp ON c.user_id = cp.user_id
    //   WHERE c.collaborator_id = $1 AND c.status = 'pending'
    // `,
    //   [userId]
    // );

    const result = await pool.query(
      `
      SELECT c.*, 
        CASE 
          WHEN u.role = '1' OR u.role = '4' THEN p.username
          WHEN u.role = '2' THEN cp.username
          WHEN u.role = '3' THEN hp.username
          ELSE NULL
        END AS collaborator_username
      FROM collaborators c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN profile p ON u.id = p.user_id
      LEFT JOIN co_profile cp ON u.id = cp.user_id
      LEFT JOIN hp_profile hp ON u.id = hp.user_id
      WHERE c.collaborator_id = $1 AND c.status = 'pending'
    `,
      [userId]
    );
    // Instead of returning a 404 error, just return an empty array if no requests are found
    res.json(result.rows); // This will return an empty array if no rows are found

    // if (result.rows.length > 0) {
    //   res.json(result.rows); // Return the pending requests
    // } else {
    //   res.status(404).json({ message: "No pending collaboration requests." });
    // }
  } catch (error) {
    console.error("Error fetching pending collaboration requests:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCollaborationRequest,
  getCollaborationRequests,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
  getAllAcceptedCollaborations,
  getUserDetailsForCollaboration,
  getCaregiverInformation,
  deleteCollaboration,
  getPendingCollaborationRequests,
};
