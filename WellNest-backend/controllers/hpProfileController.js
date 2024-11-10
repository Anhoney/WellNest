// hpProfileController.js
const pool = require("../config/db"); // Assuming db connection is setup here
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get profile data
exports.getHpProfile = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query(
      "SELECT * FROM hp_profile WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update profile data
exports.updateHpProfile = [
  upload.single("profileImage"),
  async (req, res) => {
    const userId = req.params.userId;
    const { profileData } = JSON.parse(req.body.profileData);
    let profileImagePath = req.file ? req.file.path : null;

    try {
      // Insert or update profile data
      await pool.query(
        `INSERT INTO hp_profile (user_id, username, age, gender, identification_card_number, date_of_birth, phone_number, 
          email, address, emergency_contact, summary, education, credentials, languages, services, business_hours, 
          business_days, experience, specialist, hospital, profile_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (user_id) DO UPDATE SET 
          username = $2, age = $3, gender = $4, identification_card_number = $5, date_of_birth = $6, phone_number = $7,
          email = $8, address = $9, emergency_contact = $10, summary = $11, education = $12, credentials = $13, 
          languages = $14, services = $15, business_hours = $16, business_days = $17, experience = $18, 
          specialist = $19, hospital = $20, profile_image = COALESCE($21, profile_image)`,
        [
          userId,
          profileData.username,
          profileData.age,
          profileData.gender,
          profileData.identificationCardNumber,
          profileData.dateOfBirth,
          profileData.phoneNumber,
          profileData.email,
          profileData.address,
          profileData.emergencyContact,
          profileData.summary,
          profileData.education,
          profileData.credentials,
          profileData.languages,
          profileData.services,
          profileData.businessHours,
          profileData.businessDays,
          profileData.experience,
          profileData.specialist,
          profileData.hospital,
          profileImagePath,
        ]
      );
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  },
];
