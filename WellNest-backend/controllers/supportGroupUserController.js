//supportGroupUserController.js
const pool = require("../config/db");

// Function to add a user to a support group
const addSupportGroupUser = async (req, res) => {
  const { group_id, user_id, date } = req.body;
  // Check if the user is already a member of the group
  const checkMembershipQuery = `
  SELECT * FROM support_group_user 
  WHERE group_id = $1 AND user_id = $2
  `;

  try {
    const membershipCheckResult = await pool.query(checkMembershipQuery, [
      group_id,
      user_id,
    ]);

    if (membershipCheckResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User  is already a member of this support group." });
    }

    // Insert the user into the support group
    const query = `INSERT INTO support_group_user (group_id, user_id, join_date) VALUES ($1, $2, $3) RETURNING *`;

    const result = await pool.query(query, [group_id, user_id, date]);
    if (result.rows.length === 0) {
      return res
        .status(500)
        .json({ error: `Failed to add user to support group ${group_id}` });
    }

    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error adding user to support group:", error);
    res
      .status(500)
      .json({ error: `Failed to add user to support group ${group_id}` });
  }
};

// Function to fetch all users in a specific support group by group ID
const getAllSupportGroupUserByGroupId = async (req, res) => {
  const { group_id } = req.params;

  const query = `
    SELECT
        support_group_user.id,
        support_group_user.group_id,
        support_group_user.user_id,
        users.full_name,
        users.phone_no,
        users.email
    FROM
        support_group_user
    JOIN
        users ON support_group_user.user_id = users.id
    WHERE
        support_group_user.group_id = $1;
    `;

  const value = [group_id];

  try {
    const result = await pool.query(query, value);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Support Group user not found." });
    }
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching support group messages:", error.message);
    res.status(500).json({ error: "Failed to fetch support group users." });
  }
};

// Function to delete a user from a support group
const deleteSupportGroupUser = async (req, res) => {
  const { group_id, user_id } = req.body;

  const query = `DELETE FROM support_group_user WHERE group_id = $1 AND user_id = $2 RETURNING *`;

  try {
    const result = await pool.query(query, [group_id, user_id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `User not found or already deleted` });
    }
    return res.status(200).json({
      message: "Support Group User deleted successfully",
      support_group: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user from support group:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to delete user from support group." });
  }
};

// Function to fetch all support groups a specific user
const getAllSupportGroupByUserId = async (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT
        support_group_user.id,
        support_group_user.group_id,
        support_group_user.user_id,
        users.full_name,
        users.phone_no,
        users.email
    FROM
        support_group_user
    JOIN
        users ON support_group_user.user_id = users.id
    WHERE
        support_group_user.user_id  = $1;
    `;

  const value = [user_id];

  try {
    const result = await pool.query(query, value);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Support Group not found." });
    }
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching support group messages:", error.message);
    res.status(500).json({ error: "Failed to fetch support group users." });
  }
};

module.exports = {
  addSupportGroupUser,
  deleteSupportGroupUser,
  getAllSupportGroupUserByGroupId,
  getAllSupportGroupByUserId,
};
