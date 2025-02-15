//registerContoller.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const multer = require("multer");
const crypto = require("crypto"); // Import crypto module

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }).fields([
  { name: "identityCardFile", maxCount: 1 }, // Field for identity card file
  { name: "healthcareLicenseFile", maxCount: 1 }, // Field for healthcare license file
  { name: "communityOrganizerFile", maxCount: 1 }, // Field for community organizer file
]);

// AES Encryption/Decryption Helper Functions
const algorithm = "aes-256-cbc";
const secretKey = process.env.AES_SECRET_KEY || "1234-32-char-secret-key"; // Must be 32 chars
const iv = crypto.randomBytes(16); // Generate IV for encryption

// Encrypt function to encrypt sensitive data
const encryptData = (text) => {
  const key = process.env.AES_SECRET_KEY; // Get the secret key from environment variables

  // Validate the key length
  if (!key || key.length !== 32) {
    throw new Error("Invalid AES key length. Must be exactly 32 characters.");
  }

  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(key, "utf-8"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`; // Return IV with encrypted data
};

// Decrypt function to decrypt sensitive data
const decryptData = (encryptedText) => {
  const parts = encryptedText.split(":"); // Split the encrypted text into IV and data
  const iv = Buffer.from(parts.shift(), "hex"); // Get the IV
  const encryptedData = parts.join(":"); // Join the remaining parts as encrypted data
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted; // Return the decrypted data
};

// Register User
const registerUser = async (req, res) => {
  // Handle file uploads and user registration
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

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

    try {
      // Encrypt Identity Card before storing it
      const encryptedIdentityCard = encryptData(identityCard);

      // Check if identity card is unique
      const identityCheckQuery = "SELECT * FROM users WHERE identity_card = $1";
      const identityCheck = await pool.query(identityCheckQuery, [
        encryptedIdentityCard,
      ]);

      if (identityCheck.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "Identity card number already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare file buffers
      const identityCardFile = req.files.identityCardFile
        ? req.files.identityCardFile[0].buffer
        : null;
      const healthcareLicenseFile = req.files.healthcareLicenseFile
        ? req.files.healthcareLicenseFile[0].buffer
        : null;
      const communityOrganizerFile = req.files.communityOrganizerFile
        ? req.files.communityOrganizerFile[0].buffer
        : null;

      // Insert user into database
      const insertQuery = `
      INSERT INTO users (full_name, phone_no, email, identity_card, password, role, healthcare_license, identity_card_image, healthcare_license_document, 
          community_organizer_document)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
      `;

      const values = [
        fullName,
        phoneNo,
        email,
        encryptedIdentityCard, // Store encrypted identity card
        hashedPassword,
        parseInt(role, 10),
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
