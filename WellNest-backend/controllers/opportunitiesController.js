// opportunitiesController.js
const pool = require("../config/db");
const { notifyUser } = require("./notificationController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure 'uploads/' folder exists, if not create it dynamically
    const dir = "uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, "uploads/"); // Ensure this folder exists in your project
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

// Create a Multer instance for handling file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow certain file types (jpg, png, jpeg)
    const fileTypes = /jpeg|avif|jpg|png|webp/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    console.error("File type not allowed:", file.mimetype);
    cb(new Error("Only image files are allowed!"), false); // Reject files that do not match the allowed types
  },
}); // Define upload but do not call .single here

// Create a new opportunity
const createOpportunity = async (req, res) => {
  const {
    title,
    fees,
    location,
    date, // Date string, to be formatted for PostgreSQL
    time, // Time string
    notes,
    terms_and_conditions,
    registration_due, // Date string for registration due
    capacity,
    opportunity_status,
  } = req.body;

  const { co_id } = req.params;

  // For binary data storage
  const photo = req.file ? req.file.path : null;

  let photoData = null;
  if (photo) {
    try {
      // Read the image file as binary data
      photoData = fs.readFileSync(photo);
    } catch (error) {
      console.error("Error reading profile image:", error);
      return res.status(500).json({ error: "Failed to read profile image" });
    }
  }
  try {
    // Insert the new opportunity into the database
    const query = await pool.query(
      `
      INSERT INTO co_available_opportunities (
      co_id, title, fees, location, opportunity_date, opportunity_time, notes, 
      terms_and_conditions, photo, registration_due, capacity, opportunity_status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `,
      [
        co_id,
        title,
        fees || null,
        location,
        date,
        time,
        notes || null,
        terms_and_conditions,
        photoData,
        registration_due || null,
        capacity || null,
        opportunity_status || null,
      ]
    );

    res.status(201).json({ message: "Opportunity created successfully!" });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    res.status(500).json({ error: "Failed to create opportunity" });
  }
};

// Function to get appointment details by hp_app_id
const getOpportunity = async (req, res) => {
  const { opportunity_id } = req.params;

  try {
    // Query to fetch the opportunity details
    const query = `
        SELECT 
          o.id, 
          o.co_id, 
          o.title, 
          o.fees, 
          o.location, 
          o.opportunity_date, 
          o.opportunity_time, 
          o.notes, 
          o.terms_and_conditions, 
          o.capacity, 
          o.opportunity_status,
          CASE 
            WHEN o.photo IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(o.photo, 'base64')) 
            ELSE NULL 
          END AS photo, 
          o.registration_due, 
          o.created_at,
          p.username, 
          p.organizer_details
        FROM co_available_opportunities o
        LEFT JOIN co_profile p ON o.co_id = p.user_id
        WHERE o.id = $1

      `;

    const result = await pool.query(query, [opportunity_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Opportunity not found." });
    }

    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching opportunity details:", error);
    res.status(500).json({ error: "Failed to fetch opportunity details." });
  }
};

// Update an existing opportunity
const updateOpportunity = async (req, res) => {
  const { opportunity_id } = req.params;
  const {
    title,
    fees,
    location,
    date,
    time,
    notes,
    terms_and_conditions,
    registration_due,
    capacity,
    opportunity_status,
  } = req.body;

  // For binary data storage
  const photo = req.file ? req.file.path : null;

  let photoData = null;
  if (photo) {
    try {
      // Read the image file as binary data
      photoData = fs.readFileSync(photo);
    } catch (error) {
      console.error("Error reading profile image:", error);
      return res.status(500).json({ error: "Failed to read profile image" });
    }
  }

  try {
    // Update the opportunity details in the database
    const query = `
        UPDATE co_available_opportunities
        SET 
          title = $1, fees = $2, location = $3, opportunity_date = $4, opportunity_time = $5, 
          notes = $6, terms_and_conditions = $7, photo = COALESCE($8, photo), registration_due = $9,
          capacity = $10, opportunity_status = $11
        WHERE id = $12
      `;
    const result = await pool.query(query, [
      title,
      fees || null,
      location,
      date,
      time,
      notes || null,
      terms_and_conditions,
      photoData || null,
      registration_due || null,
      capacity || null,
      opportunity_status || null,
      opportunity_id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Opportunity not found." });
    }

    res.status(200).json({ message: "Opportunity updated successfully!" });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    res.status(500).json({ error: "Failed to update opportunity." });
  }
};

// Delete an opportunity
const deleteOpportunity = async (req, res) => {
  const { opportunity_id } = req.params;

  try {
    // Query to delete the opportunity
    const query = `DELETE FROM co_available_opportunities WHERE id = $1`;
    const result = await pool.query(query, [opportunity_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Opportunity not found." });
    }

    res.status(200).json({ message: "Opportunity deleted successfully!" });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    res.status(500).json({ error: "Failed to delete opportunity." });
  }
};

// Get opportunities created by a specific user (community organizer)
const getOpportunitiesByUserId = async (req, res) => {
  const { co_id } = req.params; // Extract user ID from the route params
  const { search } = req.query; // Get the search query from the request

  try {
    // Query to fetch opportunities for the user
    const query = `
      SELECT 
        id, co_id, title, fees, location, 
        opportunity_date, 
        opportunity_time, 
        notes, terms_and_conditions, capacity, opportunity_status,
        CASE 
          WHEN photo IS NOT NULL 
          THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64')) 
          ELSE NULL 
        END AS photo, 
        registration_due, created_at
      FROM co_available_opportunities
      WHERE co_id = $1
      ${
        search ? "AND title ILIKE $2" : ""
      } -- Filter by title if search is provided
    `;

    const params = search ? [co_id, `%${search}%`] : [co_id]; // Prepare parameters for the query
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ opportunities: [] });
    }

    res.status(200).json({ opportunities: result.rows });
  } catch (error) {
    console.error("Error fetching opportunitys by user ID:", error);
    res.status(500).json({ error: "Failed to fetch opportunitys." });
  }
};

// Add a participant to an opportunity
const addParticipantToOpportunity = async (req, res) => {
  const { opportunity_id } = req.params;
  const { user_id } = req.body; // Assuming user_id is passed in the body

  try {
    // Insert participant into the opportunity
    const query = `INSERT INTO opportunity_participants (opportunity_id, user_id) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [opportunity_id, user_id]);
    res.status(201).json({
      message: "Participant added successfully",
      participant: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      // Duplicate key error code
      console.error("Error adding participant:", error);
      return res
        .status(400)
        .json({ error: "You have already registered for this event." });
    }
    console.error("Error adding participant:", error);
    res.status(500).json({ error: "Failed to add participant" });
  }
};

// Get participants for a specific opportunity
const getOpportunityParticipants = async (req, res) => {
  const { opportunity_id } = req.params;

  try {
    // Query to fetch participants for the opportunity
    const query = `
      SELECT 
        op.id AS participant_id,
        u.id AS user_id,
        pro.username,
        u.email,
        u.phone_no
      FROM opportunity_participants op
      JOIN users u ON op.user_id = u.id
      LEFT JOIN profile pro ON op.user_id = pro.user_id
      WHERE op.opportunity_id = $1;

    `;
    const result = await pool.query(query, [opportunity_id]);

    res.status(200).json({ participants: result.rows });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

// Get the count of participants for a specific opportunity
const getParticipantCount = async (req, res) => {
  const { opportunity_id } = req.params;

  try {
    // Query to count participants for the opportunity
    const query = `SELECT COUNT(*) FROM opportunity_participants WHERE opportunity_id = $1`;
    const result = await pool.query(query, [opportunity_id]);
    res.status(200).json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching participant count:", error);
    res.status(500).json({ error: "Failed to fetch participant count" });
  }
};

// Elderly
// Get opportunities for the elderly site
const getOpportunitiesElderlySite = async (req, res) => {
  const { search } = req.query; // Get the search query from the request

  try {
    // Base query to fetch opportunities
    let query = `
      SELECT
        e.id, e.co_id, e.title, e.fees, e.location,
        e.opportunity_date, e.opportunity_time, e.notes,
        e.terms_and_conditions, e.capacity, e.opportunity_status,
        CASE
          WHEN e.photo IS NOT NULL
          THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
          ELSE NULL
        END AS photo,
        e.registration_due, e.created_at,
        COUNT(ep.user_id) AS participant_count
      FROM co_available_opportunities e
      LEFT JOIN opportunity_participants ep ON e.id = ep.opportunity_id
      WHERE 
        e.registration_due >= CURRENT_DATE
        AND e.opportunity_status = 'Active'
    `;

    // Add search condition if provided
    const params = [];
    if (search) {
      query += " AND e.title ILIKE $1"; // Append the search condition
      params.push(`%${search}%`); // Add the search term to params
    }

    query += " GROUP BY e.id"; // Ensure GROUP BY is always included

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ opportunities: [] });
    }

    // Filter out opportunities where participant count is greater than or equal to capacity
    const filteredOpportunities = result.rows.filter(
      (opportunity) => opportunity.participant_count < opportunity.capacity
    );

    res.status(200).json({ opportunities: filteredOpportunities });
  } catch (error) {
    console.error("Error fetching opportunities by user ID:", error);
    res.status(500).json({ error: "Failed to fetch opportunities." });
  }
};

// Get registered opportunities for a specific user
const getRegisteredOpportunitiesByUserId = async (req, res) => {
  const { user_id } = req.params; // Extract user ID from the route params
  const { search } = req.query;

  try {
    let query = `
    SELECT 
      e.id, e.co_id, e.title, e.fees, e.location, 
      e.opportunity_date, e.opportunity_time, e.notes, 
      e.terms_and_conditions, 
      CASE
        WHEN e.photo IS NOT NULL
        THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
        ELSE NULL
      END AS photo, 
      e.registration_due, e.created_at, 
      e.capacity, e.opportunity_status, ep.joined_at
    FROM opportunity_participants ep
    JOIN co_available_opportunities e ON ep.opportunity_id = e.id
    WHERE ep.user_id = $1 AND e.opportunity_status = 'Active' AND ep.status = 'Ongoing'
  `;
    const params = [user_id];
    if (search) {
      query += " AND e.title ILIKE $2"; // Add search condition
      params.push(`%${search}%`); // Add search term to params
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ opportunities: [] }); // Return empty array if no registered opportunities found
    }

    res.status(200).json({ opportunities: result.rows }); // Return the registered opportunities as JSON
  } catch (error) {
    console.error("Error fetching registered opportunities by user ID:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch registered opportunities." });
  }
};

// Get past opportunities for a specific user
const getPastOpportunitiesByUserId = async (req, res) => {
  const { user_id } = req.params;
  const { search } = req.query;

  try {
    let query = `
      SELECT 
        e.id, e.co_id, e.title, e.fees, e.location, 
        e.opportunity_date, e.opportunity_time, e.notes, 
        e.terms_and_conditions, 
        CASE
          WHEN e.photo IS NOT NULL
          THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
          ELSE NULL
        END AS photo, 
        e.registration_due, e.created_at, 
        e.capacity, e.opportunity_status
      FROM opportunity_participants ep
      JOIN co_available_opportunities e ON ep.opportunity_id = e.id
      WHERE ep.user_id = $1 AND ep.status = 'Past'
    `;

    const params = [user_id]; // Prepare parameters for the query
    if (search) {
      query += " AND e.title ILIKE $2"; // Add search condition
      params.push(`%${search}%`); // Add search term to params
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ opportunities: [] }); // Return empty array if no past opportunities found
    }

    res.status(200).json({ opportunities: result.rows });
  } catch (error) {
    console.error("Error fetching past opportunities by user ID:", error);
    res.status(500).json({ error: "Failed to fetch past opportunities." });
  }
};

// Archive an opportunity for a participant
const archiveOpportunity = async (req, res) => {
  const { opportunity_id, user_id } = req.params;

  try {
    const query = `
      UPDATE opportunity_participants
      SET status = 'Past'
      WHERE opportunity_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [opportunity_id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Opportunity not found." });
    }

    res.status(200).json({ message: "Opportunity archived successfully!" });
  } catch (error) {
    console.error("Error archiving opportunity:", error);
    res.status(500).json({ error: "Failed to archive opportunity." });
  }
};

// Unarchive an opportunity for a participant
const unarchiveOpportunity = async (req, res) => {
  const { opportunity_id, user_id } = req.params;

  try {
    const query = `
      UPDATE opportunity_participants
      SET status = 'Ongoing'
      WHERE opportunity_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [opportunity_id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Opportunity not found." });
    }

    res.status(200).json({ message: "Opportunity archived successfully!" });
  } catch (error) {
    console.error("Error archiving opportunity:", error);
    res.status(500).json({ error: "Failed to archive opportunity." });
  }
};

// Check if a user is registered for an opportunity
const checkOpportunityRegistration = async (req, res) => {
  const { user_id, opportunity_id } = req.params; // Extract user ID and opportunity ID from the route params

  try {
    const query = `
      SELECT * FROM opportunity_participants 
      WHERE user_id = $1 AND opportunity_id = $2
    `;
    const result = await pool.query(query, [user_id, opportunity_id]);

    if (result.rows.length > 0) {
      return res.status(200).json({ registered: true });
    } else {
      return res.status(200).json({ registered: false });
    }
  } catch (error) {
    console.error("Error checking opportunity registration:", error);
    res.status(500).json({ error: "Failed to check registration." });
  }
};

// Delete a participant from an opportunity
const deleteParticipant = async (req, res) => {
  const { opportunity_id, user_id } = req.params; // Extract the participant ID from the route params

  try {
    const query = `
      DELETE FROM opportunity_participants 
      WHERE opportunity_id = $1 AND user_id = $2
      RETURNING *;  -- Return the deleted row for confirmation
    `;
    const result = await pool.query(query, [opportunity_id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Participant not found." });
    }

    res.status(200).json({
      message: "Participant deleted successfully!",
      participant: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting participant:", error);
    res.status(500).json({ error: "Failed to delete participant." });
  }
};

module.exports = {
  createOpportunity,
  upload,
  getOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunitiesByUserId,
  addParticipantToOpportunity,
  getOpportunityParticipants,
  getParticipantCount,
  getOpportunitiesElderlySite,
  getRegisteredOpportunitiesByUserId,
  archiveOpportunity,
  getPastOpportunitiesByUserId,
  unarchiveOpportunity,
  checkOpportunityRegistration,
  deleteParticipant,
};
