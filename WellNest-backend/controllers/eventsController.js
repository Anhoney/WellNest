// eventsController.js
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
    cb(new Error("Only image files are allowed!"), false);
  },
}); // Define upload but do not call .single here

const createEvent = async (req, res) => {
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
    event_status,
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
       INSERT INTO co_available_events (
      co_id, title, fees, location, event_date, event_time, notes, 
      terms_and_conditions, photo, registration_due, capacity, event_status
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
        event_status || null,
      ]
    );

    res.status(201).json({ message: "Event created successfully!" });
    // res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Function to get appointment details by hp_app_id
const getEvent = async (req, res) => {
  const { event_id } = req.params;

  try {
    const query = `
        SELECT 
        id, co_id, title, fees, location, 
        TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date, 
        TO_CHAR(event_time, 'HH12:MI AM') AS event_time, 
        notes, terms_and_conditions, capacity, event_status,
        CASE 
          WHEN photo IS NOT NULL 
          THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64')) 
          ELSE NULL 
        END AS photo, 
        registration_due, created_at
      FROM co_available_events
      WHERE id = $1
      `;

    const result = await pool.query(query, [event_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Failed to fetch appointment details." });
  }
};

// Update an existing event
const updateEvent = async (req, res) => {
  const { event_id } = req.params;
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
    event_status,
  } = req.body;
  const photo = req.file ? req.file.buffer : null;

  try {
    const query = `
        UPDATE co_available_events
        SET 
          title = $1, fees = $2, location = $3, event_date = $4, event_time = $5, 
          notes = $6, terms_and_conditions = $7, photo = $8, registration_due = $9,
          capacity = $10, event_status = $11
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
      photo,
      registration_due || null,
      capacity || null,
      event_status || null,
      event_id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event updated successfully!" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event." });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  const { event_id } = req.params;

  try {
    const query = `DELETE FROM co_available_events WHERE id = $1`;
    const result = await pool.query(query, [event_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event." });
  }
};

const getEventsByUserId = async (req, res) => {
  const { co_id } = req.params; // Extract user ID from the route params

  try {
    const query = `
      SELECT 
        id, co_id, title, fees, location, 
        TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date, 
        TO_CHAR(event_time, 'HH12:MI AM') AS event_time, 
        notes, terms_and_conditions, capacity, event_status,
        CASE 
          WHEN photo IS NOT NULL 
          THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64')) 
          ELSE NULL 
        END AS photo, 
        registration_due, created_at
      FROM co_available_events
      WHERE co_id = $1
    `;
    const result = await pool.query(query, [co_id]);

    if (result.rows.length === 0) {
      return res.status(200).json({ events: [] });
    }

    res.status(200).json({ events: result.rows });
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

// const getEventsByUserId = async (req, res) => {
//   const { co_id } = req.params; // Extract user ID from the route params

//   try {
//     const query = `
//       SELECT
//         id, co_id, title, fees, location,
//         TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
//         TO_CHAR(event_time, 'HH12:MI AM') AS event_time,
//         notes, terms_and_conditions,
//         CASE
//           WHEN photo IS NOT NULL
//           THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64'))
//           ELSE NULL
//         END AS photo,
//         registration_due, created_at
//       FROM co_available_events
//       WHERE co_id = $1
//     `;
//     const result = await pool.query(query, [co_id]);

//     if (result.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No medications found for this user." });
//     }

//     res.status(200).json(result.rows); // Send all medications as response
//   } catch (error) {
//     console.error("Error fetching medications:", error);
//     res.status(500).json({ error: "Failed to fetch medications." });
//   }
// };

module.exports = {
  createEvent,
  upload,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventsByUserId,
};
