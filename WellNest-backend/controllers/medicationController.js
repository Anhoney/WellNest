//medicationController.js
const pool = require("../config/db");
const { notifyUser, createNotification } = require("./notificationController"); // Import createNotification
const { format } = require("date-fns");

const createReminder = async (req, res) => {
  const {
    pillName,
    amount,
    duration,
    time,
    foodRelation,
    repeatOption,
    userId,
  } = req.body; // Include repeatOption and userId
  console.log("Request Body:", req.body);
  let medicineImage = null;
  console.log("pill name", pillName);
  // Check if a file was uploaded
  if (req.file) {
    medicineImage = req.file.path; // Store the file path
  }

  try {
    const result = await pool.query(
      `INSERT INTO medications (pill_name, amount, duration, time, food_relation, repeat_option, medicine_image, u_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        pillName,
        amount,
        duration,
        time,
        foodRelation,
        repeatOption,
        medicineImage,
        userId,
      ] // Include all fields
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving medication reminder:", error.message);
    res.status(500).json({ error: "Failed to save medication reminder." });
  }
};

const getMedications = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM medications WHERE u_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    // `SELECT id, pill_name, amount, duration, time, food_relation, repeat_option, medicine_image, created_at, u_id
    //    FROM medications WHERE u_id = $1 ORDER BY created_at DESC`,
    //   [userId]
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching medications:", error.message);
    res.status(500).json({ error: "Failed to fetch medications." });
  }
};

module.exports = {
  createReminder,
  getMedications,
};

// const pool = require("../config/db");
// const { notifyUser, createNotification } = require("./notificationController");
// const { format } = require("date-fns");
// const fs = require("fs");
// const path = require("path");

// const createReminder = async (req, res) => {
//   const {
//     pillName,
//     amount,
//     duration,
//     time,
//     foodRelation,
//     repeatOption,
//     userId,
//   } = req.body;
//   const file = req.files ? req.files.medicineImage : null;

//   try {
//     // Handle file upload if a file is selected
//     let medicineImagePath = null;
//     if (file) {
//       const fileName = `${Date.now()}-${file.name}`;
//       medicineImagePath = path.join(__dirname, "../uploads", fileName);
//       file.mv(medicineImagePath, (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Error uploading the file" });
//         }
//       });
//     }

//     const result = await pool.query(
//       `INSERT INTO medications (pill_name, amount, duration, time, food_relation, repeat_option, u_id, medicine_image)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       RETURNING *`,
//       [
//         pillName,
//         amount,
//         duration,
//         time,
//         foodRelation,
//         repeatOption,
//         userId,
//         medicineImagePath,
//       ]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error saving medication reminder:", error.message);
//     res.status(500).json({ error: "Failed to save medication reminder." });
//   }
// };

// const getMedications = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT * FROM medications WHERE u_id = $1 ORDER BY created_at DESC`,
//       [userId]
//     );
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching medications:", error.message);
//     res.status(500).json({ error: "Failed to fetch medications." });
//   }
// };

// module.exports = { createReminder, getMedications };
