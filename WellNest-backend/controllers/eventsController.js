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

//Community Organizers
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
  console.log("getEventId", event_id);
  try {
    const query = `
        SELECT 
          e.id, 
          e.co_id, 
          e.title, 
          e.fees, 
          e.location, 
          e.event_date, 
          e.event_time, 
          e.notes, 
          e.terms_and_conditions, 
          e.capacity, 
          e.event_status,
          CASE 
            WHEN e.photo IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64')) 
            ELSE NULL 
          END AS photo, 
          e.registration_due, 
          e.created_at,
          p.username, 
          p.organizer_details
        FROM co_available_events e
        LEFT JOIN co_profile p ON e.co_id = p.user_id
        WHERE e.id = $1

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
  console.log("updateEventId", event_id);
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
    // photo,// Base64 or binary data if sent
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
        UPDATE co_available_events
        SET 
          title = $1, fees = $2, location = $3, event_date = $4, event_time = $5, 
          notes = $6, terms_and_conditions = $7, photo = COALESCE($8, photo), registration_due = $9,
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
      // photo,
      photoData || null,
      // ..(photoData ? [photoData] : []),
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
  const { search } = req.query; // Get the search query from the request

  try {
    const query = `
      SELECT 
        id, co_id, title, fees, location, 
        event_date, 
        event_time, 
        notes, terms_and_conditions, capacity, event_status,
        CASE 
          WHEN photo IS NOT NULL 
          THEN CONCAT('data:image/png;base64,', ENCODE(photo, 'base64')) 
          ELSE NULL 
        END AS photo, 
        registration_due, created_at
      FROM co_available_events
      WHERE co_id = $1
      ${
        search ? "AND title ILIKE $2" : ""
      } -- Filter by title if search is provided
    `;

    const params = search ? [co_id, `%${search}%`] : [co_id]; // Prepare parameters for the query
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ events: [] });
    }

    res.status(200).json({ events: result.rows });
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

const addParticipantToEvent = async (req, res) => {
  const { event_id } = req.params;
  const { user_id } = req.body; // Assuming user_id is passed in the body

  try {
    const query = `INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [event_id, user_id]);
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

const getEventParticipants = async (req, res) => {
  const { event_id } = req.params;
  console.log("Fetching participants for event_id:", event_id); // Log the event_id

  try {
    const query = `
      SELECT 
        ep.id AS participant_id,
        u.id AS user_id,
        pro.username,
        u.email,
        u.phone_no
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      LEFT JOIN profile pro ON ep.user_id = pro.user_id
      WHERE ep.event_id = $1;

    `;
    const result = await pool.query(query, [event_id]);

    console.log("Query result:", result.rows); // Log the result of the query

    if (result.rows.length === 0) {
      console.log("No participants found for this event."); // Log if no participants found
    }

    res.status(200).json({ participants: result.rows });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

const getParticipantCount = async (req, res) => {
  const { event_id } = req.params;

  try {
    const query = `SELECT COUNT(*) FROM event_participants WHERE event_id = $1`;
    const result = await pool.query(query, [event_id]);
    res.status(200).json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching participant count:", error);
    res.status(500).json({ error: "Failed to fetch participant count" });
  }
};

//Elderly site
const getEventsElderlySite = async (req, res) => {
  // const { co_id } = req.params; // Extract user ID from the route params
  const { search } = req.query; // Get the search query from the request

  try {
    // Base query
    let query = `
      SELECT
        e.id, e.co_id, e.title, e.fees, e.location,
        e.event_date, e.event_time, e.notes,
        e.terms_and_conditions, e.capacity, e.event_status,
        CASE
          WHEN e.photo IS NOT NULL
          THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
          ELSE NULL
        END AS photo,
        e.registration_due, e.created_at,
        COUNT(ep.user_id) AS participant_count
      FROM co_available_events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      WHERE 
         e.registration_due >= CURRENT_DATE
        AND e.event_status = 'Active'
    `;

    // Add search condition if provided
    const params = [];
    if (search) {
      query += " AND e.title ILIKE $1"; // Append the search condition
      params.push(`%${search}%`); // Add the search term to params
    }

    // query += " GROUP BY e.id"; // Ensure GROUP BY is always included
    query += `
    GROUP BY e.id
    HAVING COUNT(ep.user_id) < CAST(e.capacity AS INTEGER)
  `;

    // const params = search ? [`%${search}%`] : []; // Prepare parameters for the query
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ events: [] });
    }

    // Filter out events where participant count is greater than or equal to capacity
    const filteredEvents = result.rows.filter(
      (event) => event.participant_count < event.capacity
    );

    res.status(200).json({ events: filteredEvents });
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

const getRegisteredEventsByUserId = async (req, res) => {
  const { user_id } = req.params; // Extract user ID from the route params
  const { search } = req.query;

  try {
    // const query = `
    //   SELECT
    //     e.id, e.co_id, e.title, e.fees, e.location,
    //     e.event_date, e.event_time, e.notes,
    //     e.terms_and_conditions,
    //     CASE
    //       WHEN e.photo IS NOT NULL
    //       THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
    //       ELSE NULL
    //     END AS photo,
    //     e.registration_due, e.created_at,
    //     e.capacity, e.event_status, ep.joined_at
    //   FROM event_participants ep
    //   JOIN co_available_events e ON ep.event_id = e.id
    //   WHERE ep.user_id = $1 AND e.event_status = 'Active' AND ep.status = 'Ongoing'
    // `;
    let query = `
    SELECT 
      e.id, e.co_id, e.title, e.fees, e.location, 
      e.event_date, e.event_time, e.notes, 
      e.terms_and_conditions, 
      CASE
        WHEN e.photo IS NOT NULL
        THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
        ELSE NULL
      END AS photo, 
      e.registration_due, e.created_at, 
      e.capacity, e.event_status, ep.joined_at
    FROM event_participants ep
    JOIN co_available_events e ON ep.event_id = e.id
    WHERE ep.user_id = $1 AND e.event_status = 'Active' AND ep.status = 'Ongoing'
  `;
    const params = [user_id];
    if (search) {
      query += " AND e.title ILIKE $2"; // Add search condition
      params.push(`%${search}%`); // Add search term to params
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ events: [] });
    }

    res.status(200).json({ events: result.rows });
    // const result = await pool.query(query, [user_id]);

    // if (result.rows.length === 0) {
    //   return res.status(200).json({ events: [] });
    // }

    // res.status(200).json({ events: result.rows });
  } catch (error) {
    console.error("Error fetching registered events by user ID:", error);
    res.status(500).json({ error: "Failed to fetch registered events." });
  }
};

const getPastEventsByUserId = async (req, res) => {
  const { user_id } = req.params;
  const { search } = req.query;

  try {
    let query = `
      SELECT 
        e.id, e.co_id, e.title, e.fees, e.location, 
        e.event_date, e.event_time, e.notes, 
        e.terms_and_conditions, 
        CASE
          WHEN e.photo IS NOT NULL
          THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
          ELSE NULL
        END AS photo, 
        e.registration_due, e.created_at, 
        e.capacity, e.event_status
      FROM event_participants ep
      JOIN co_available_events e ON ep.event_id = e.id
      WHERE ep.user_id = $1 AND ep.status = 'Past'
    `;
    // const query = `
    //   SELECT
    //     e.id, e.co_id, e.title, e.fees, e.location,
    //     e.event_date, e.event_time, e.notes,
    //     e.terms_and_conditions,
    //     CASE
    //       WHEN e.photo IS NOT NULL
    //       THEN CONCAT('data:image/png;base64,', ENCODE(e.photo, 'base64'))
    //       ELSE NULL
    //     END AS photo,
    //     e.registration_due, e.created_at,
    //     e.capacity, e.event_status
    //   FROM event_participants ep
    //   JOIN co_available_events e ON ep.event_id = e.id
    //   WHERE ep.user_id = $1 AND ep.status = 'Past'
    // `;
    const params = [user_id];
    if (search) {
      query += " AND e.title ILIKE $2"; // Add search condition
      params.push(`%${search}%`); // Add search term to params
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json({ events: [] });
    }

    res.status(200).json({ events: result.rows });
    // const result = await pool.query(query, [user_id]);

    // if (result.rows.length === 0) {
    //   return res.status(200).json({ events: [] });
    // }
    // console.log(result.rows);
    // res.status(200).json({ events: result.rows });
  } catch (error) {
    console.error("Error fetching past events by user ID:", error);
    res.status(500).json({ error: "Failed to fetch past events." });
  }
};

const archiveEvent = async (req, res) => {
  const { event_id, user_id } = req.params;

  try {
    const query = `
      UPDATE event_participants
      SET status = 'Past'
      WHERE event_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [event_id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event archived successfully!" });
  } catch (error) {
    console.error("Error archiving event:", error);
    res.status(500).json({ error: "Failed to archive event." });
  }
};

const unarchiveEvent = async (req, res) => {
  const { event_id, user_id } = req.params;

  try {
    const query = `
      UPDATE event_participants
      SET status = 'Ongoing'
      WHERE event_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [event_id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event archived successfully!" });
  } catch (error) {
    console.error("Error archiving event:", error);
    res.status(500).json({ error: "Failed to archive event." });
  }
};

const checkEventRegistration = async (req, res) => {
  const { user_id, event_id } = req.params; // Extract user ID and opportunity ID from the route params

  try {
    const query = `
      SELECT * FROM event_participants 
      WHERE user_id = $1 AND event_id = $2
    `;
    const result = await pool.query(query, [user_id, event_id]);

    if (result.rows.length > 0) {
      return res.status(200).json({ registered: true });
    } else {
      return res.status(200).json({ registered: false });
    }
  } catch (error) {
    console.error("Error checking event registration:", error);
    res.status(500).json({ error: "Failed to check registration." });
  }
};

const deleteParticipant = async (req, res) => {
  const { event_id, user_id } = req.params; // Extract the participant ID from the route params

  try {
    const query = `
      DELETE FROM event_participants 
      WHERE event_id = $1 AND user_id = $2
      RETURNING *;  -- Return the deleted row for confirmation
    `;
    const result = await pool.query(query, [event_id, user_id]);

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
  createEvent,
  upload,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventsByUserId,
  addParticipantToEvent,
  getEventParticipants,
  getParticipantCount,
  getEventsElderlySite,
  getRegisteredEventsByUserId,
  archiveEvent,
  getPastEventsByUserId,
  unarchiveEvent,
  checkEventRegistration,
  deleteParticipant,
};
