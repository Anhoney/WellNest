// controllers/registerController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // Store files in memory for easy handling as buffers
// const upload = multer({ storage }).fields([
//   { name: "identityCardFile", maxCount: 1 },
//   { name: "healthcareLicenseFile", maxCount: 1 },
//   { name: "communityOrganizerFile", maxCount: 1 },
// ]);
const upload = multer({ storage }).fields([
  { name: "identityCardFile", maxCount: 1 },
  { name: "healthcareLicenseFile", maxCount: 1 },
  { name: "communityOrganizerFile", maxCount: 1 },
]);

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
  console.log(req.files); // Check the file upload

  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    // Proceed with the rest of the logic if files are available
    if (!req.files) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const {
      fullName,
      phoneNo,
      email,
      identityCard,
      password,
      role,
      healthcareLicenseNo,
    } = req.body;

    const roleValue = parseInt(role, 10); // Make sure role is a number

    try {
      // Check if identity card number is unique
      const identityCheckQuery = "SELECT * FROM users WHERE identity_card = $1";
      const identityCheck = await pool.query(identityCheckQuery, [
        identityCard,
      ]);

      if (identityCheck.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "Identity card number already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // console.log(req.files);

      // Prepare file buffers for database insertion
      const identityCardFile = req.files.identityCardFile
        ? req.files.identityCardFile[0].buffer
        : null;
      const healthcareLicenseFile = req.files.healthcareLicenseFile
        ? req.files.healthcareLicenseFile[0].buffer
        : null;
      const communityOrganizerFile = req.files.communityOrganizerFile
        ? req.files.communityOrganizerFile[0].buffer
        : null;

      // console.log(identityCardFile);
      console.log("Pool object:", pool);
      // Insert user into the database
      const insertQuery = `
      INSERT INTO users (full_name, phone_no, email, identity_card, password, role, healthcare_license, identity_card_image, healthcare_license_document, 
          community_organizer_document)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
    `;

      const values = [
        fullName,
        phoneNo,
        email,
        identityCard,
        hashedPassword,
        roleValue,
        healthcareLicenseNo || null,
        identityCardFile,
        healthcareLicenseFile,
        communityOrganizerFile,
      ];

      const result = await pool.query(insertQuery, values);

      res.status(201).json({
        userId: result.rows[0].id,
        message: "User registered successfully",
      });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  });
};

module.exports = { registerUser };
