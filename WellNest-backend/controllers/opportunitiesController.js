// opportunitiesController.js
const pool = require("../config/db");
const { format } = require("date-fns"); // Install via `npm install date-fns`
// const {
//   triggerNotification,
// } = require("../controllers/notificationController"); // Import the triggerNotification function
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
    //   cb(null, `${Date.now()}_${file.originalname}`);
    // },
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

// const upload = multer({ storage: storage });
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
    cb(new Error("Only image files are allowed!"), false);
  },
}); // Define upload but do not call .single here

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
  console.log("Request Body:", req.body);
  // const photo = req.file ? req.file.buffer : null; // Handling binary image data
  const { co_id } = req.params;
  console.log("co_id", co_id);

  // For binary data storage
  const photo = req.file ? req.file.path : null;
  console.log(photo);
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
        // photo,
        photoData,
        registration_due || null,
        capacity || null,
        opportunity_status || null,
      ]
    );

    res.status(201).json({ message: "Event created successfully!" });
    // res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating opportunity:", error);
    res.status(500).json({ error: "Failed to create opportunity" });
  }
};

// Function to get appointment details by hp_app_id
const getOpportunity = async (req, res) => {
  const { opportunity_id } = req.params;
  console.log("getEventId", opportunity_id);
  try {
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
  console.log("updateOpportunityId", opportunity_id);
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
  console.log("Update request Body:", req.body);
  // For binary data storage
  const photo = req.file ? req.file.path : null;
  console.log(photo);
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
    const query = `
        UPDATE co_available_opportunities
        SET 
          title = $1, fees = $2, location = $3, opportunity_date = $4, opportunity_time = $5, 
          notes = $6, terms_and_conditions = $7, photo = $8, registration_due = $9,
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
      // photo,
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
    const query = `DELETE FROM co_available_opportunities WHERE id = $1`;
    const result = await pool.query(query, [opportunity_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    res.status(500).json({ error: "Failed to delete opportunity." });
  }
};

const getOpportunitiesByUserId = async (req, res) => {
  const { co_id } = req.params; // Extract user ID from the route params
  const { search } = req.query; // Get the search query from the request
  console.log("getOpportunitiesByUserId", co_id);
  try {
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
    // console.log("result.rows", result.rows);
    res.status(200).json({ opportunities: result.rows });
  } catch (error) {
    console.error("Error fetching opportunitys by user ID:", error);
    res.status(500).json({ error: "Failed to fetch opportunitys." });
  }
};

const addParticipantToOpportunity = async (req, res) => {
  const { opportunity_id } = req.params;
  const { user_id } = req.body; // Assuming user_id is passed in the body

  try {
    const query = `INSERT INTO opportunity_participants (opportunity_id, user_id) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [opportunity_id, user_id]);
    res.status(201).json({
      message: "Participant added successfully",
      participant: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({ error: "Failed to add participant" });
  }
};

const getOpportunityParticipants = async (req, res) => {
  const { opportunity_id } = req.params;
  console.log("Fetching participants for opportunity_id:", opportunity_id); // Log the opportunity_id

  try {
    const query = `
      SELECT 
        op.id AS participant_id,
        u.id AS user_id,
        pro.username,
        u.email
      FROM opportunity_participants op
      JOIN users u ON op.user_id = u.id
      LEFT JOIN profile pro ON op.user_id = pro.user_id
      WHERE op.opportunity_id = $1;

    `;
    const result = await pool.query(query, [opportunity_id]);

    console.log("Query result:", result.rows); // Log the result of the query

    if (result.rows.length === 0) {
      console.log("No participants found for this opportunity."); // Log if no participants found
    }

    res.status(200).json({ participants: result.rows });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

const getParticipantCount = async (req, res) => {
  const { opportunity_id } = req.params;
  console.log("getParticipantCount", opportunity_id);
  try {
    const query = `SELECT COUNT(*) FROM opportunity_participants WHERE opportunity_id = $1`;
    const result = await pool.query(query, [opportunity_id]);
    res.status(200).json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching participant count:", error);
    res.status(500).json({ error: "Failed to fetch participant count" });
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
};
