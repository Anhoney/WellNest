// routes/registerRoute.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db"); // Import the database connection
const router = express.Router();
const { registerUser } = require("../controllers/registerController");

// Registration route
// router.post("/register", async (req, res) => {
//   const {
//     fullName,
//     phoneNo,
//     email,
//     identityCard,
//     password,
//     role,
//     healthcareLicenseNo,
//   } = req.body;

//   try {
//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Prepare the SQL query to insert a new user
//     const insertQuery = `
//       INSERT INTO users (full_name, phone_no, email, identity_card, password, role, healthcare_license_no, created_at)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
//       RETURNING user_id;
//     `;

//     const values = [
//       fullName,
//       phoneNo,
//       email,
//       identityCard,
//       hashedPassword,
//       role,
//       role === "Healthcare Provider" ? healthcareLicenseNo : null,
//     ];

//     // Execute the insert query
//     const result = await pool.query(insertQuery, values);
//     const newUserId = result.rows[0].user_id;

//     res
//       .status(201)
//       .json({ message: "User registered successfully.", userId: newUserId });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ error: "Server error. Please try again later." });
//   }
// });

router.post("/register", registerUser);

module.exports = router;
