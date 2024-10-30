// controllers/registerController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

// Configure Multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Directory where files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp to prevent duplicates
//   },
// });

// const upload = multer({ storage: storage }).fields([
//   { name: "identityCardImage", maxCount: 1 },
//   { name: "healthcareLicenseDocument", maxCount: 1 },
//   { name: "communityOrganizerDocument", maxCount: 1 },
// ]);

const registerUser = async (req, res) => {
  //   upload(req, res, async (err) => {
  //     if (err) {
  //       console.error("Error uploading files:", err);
  //       return res.status(500).json({ error: "File upload failed" });
  //     }

  const {
    fullName,
    phoneNo,
    email,
    identityCard,
    password,
    role,
    healthcareLicenseNo,
  } = req.body;

  // File paths
  // const identityCardImage = req.files["identityCardImage"]
  //   ? req.files["identityCardImage"][0].path
  //   : null;
  // const healthcareLicenseDocument = req.files["healthcareLicenseDocument"]
  //   ? req.files["healthcareLicenseDocument"][0].path
  //   : null;
  // const communityOrganizerDocument = req.files["communityOrganizerDocument"]
  //   ? req.files["communityOrganizerDocument"][0].path
  //   : null;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const insertQuery = `
      INSERT INTO users (full_name, phone_no, email, identity_card, password, role, healthcare_license, identity_card_image, healthcare_license_document, 
          community_organizer_document)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
    `;
    const result = await pool.query(insertQuery, [
      fullName,
      phoneNo,
      email,
      identityCard,
      hashedPassword,
      role,
      healthcareLicenseNo,
      //   identityCardImage,
      //   healthcareLicenseDocument,
      //   communityOrganizerDocument,
    ]);

    res.status(201).json({
      userId: result.rows[0].user_id,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed" });
  }
  //   });
};

module.exports = { registerUser };
