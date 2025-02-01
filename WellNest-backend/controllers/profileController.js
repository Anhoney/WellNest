//profileController.js
const pool = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // To read files for conversion to binary data

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

// GET profile data by userId
const getHpProfile = async (req, res) => {
  const userId = req.params.userId;
  // console.log("User ID:", userId);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "User  ID is required" });
  }

  try {
    // Fetch data from the users table
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    const userRole = user.role;

    console.log("User Role:", userRole);
    let profileData;
    let profileQuery;

    // Fetch specific columns based on user role and profile type
    if (userRole === "1" || userRole === "4") {
      // Query for general profile users
      profileQuery = `
        SELECT id, user_id, username, age, gender,  date_of_birth,  address, 
        emergency_contact, core_qualifications, education, profile_image
        FROM profile WHERE user_id = $1
      `;
    } else if (userRole === "2") {
      // Query for community organizer profile users
      profileQuery = `
        SELECT id, user_id, username, age, gender, date_of_birth, address, 
        emergency_contact, organizer_details, profile_image
        FROM co_profile WHERE user_id = $1
      `;
    } else if (userRole === "3") {
      // Query for healthcare provider profile users
      profileQuery = `
        SELECT id, user_id, username, age, gender, date_of_birth, email, 
        address, emergency_contact, summary, education, credentials, languages, services, business_hours, 
        business_days, experience, specialist, hospital, profile_image
        FROM hp_profile WHERE user_id = $1
      `;
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

    const profileResult = await pool.query(profileQuery, [userId]);
    profileData = profileResult.rows[0] || {}; // Default to empty object if no profile data exists

    // Convert bytea to base64
    let profileImageBase64 = null;
    if (profileData.profile_image) {
      profileImageBase64 = `data:image/jpeg;base64,${profileData.profile_image.toString(
        "base64"
      )}`;
    }

    // Combine data from users and profile table
    const data = {
      full_name: user.full_name,
      email: user.email,
      phone_no: user.phone_no,
      identity_card: user.identity_card,
      role: user.role,
      profile_image: profileImageBase64, // Send base64-encoded image
      // profile_image: profileData.profile_image
      //   ? `/uploads/${profileData.profile_image}`
      //   : null,
      ...profileData,
    };
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ error: "Error fetching profile data" });
  }
};

// const fs = require("fs"); // To read files for conversion to binary data

// UPDATE or INSERT profile data based on role
const updateHpProfile = async (req, res) => {
  const userId = req.params.userId;
  // Using req.file to handle the uploaded file
  // const userId = parseInt(req.params.userId, 10); // Ensure integer

  const {
    // full_name,
    username,
    age,
    gender,
    identity_card,
    date_of_birth,
    phone_number,
    email,
    address,
    emergency_contact,
    summary,
    education,
    credentials,
    languages,
    services,
    business_hours,
    business_days,
    experience,
    specialist,
    hospital,
    core_qualifications,
    organizer_details,
  } = req.body;
  const ageValue = age === "NaN" || age === "" || age === null ? null : age;

  // const profileImagePath = req.file ? req.file.path : null;
  // For binary data storage
  const profileImagePath = req.file ? req.file.path : null;
  console.log(profileImagePath);
  let profileImageData = null;
  if (profileImagePath) {
    try {
      // Read the image file as binary data
      profileImageData = fs.readFileSync(profileImagePath);
    } catch (error) {
      console.error("Error reading profile image:", error);
      return res.status(500).json({ error: "Failed to read profile image" });
    }
  }

  try {
    console.log("User ID:", userId);
    // Verify user existence and retrieve their role
    const roleQuery = "SELECT role FROM users WHERE id = $1";
    const roleResult = await pool.query(roleQuery, [userId]);

    console.log("Body:", req.body); // Logs text fields
    console.log("File:", req.file); // Logs file data
    // Check if file is present
    if (req.file) {
      console.log("Uploaded file:", req.file);
    } else {
      console.log("No file uploaded.");
    }

    if (roleResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRole = roleResult.rows[0].role;
    console.log("User Role:", userRole);
    let profileTable, updateQuery, insertQuery, queryParams;

    if (userRole === "1" || userRole === "4") {
      // For general profile users
      profileTable = "profile";

      if (profileImagePath === null) {
        updateQuery = `
        UPDATE profile 
SET username = $1, age = $2, gender = $3, date_of_birth = $4, 
    address = $5, emergency_contact = $6, 
    core_qualifications = $7, education = $8
WHERE user_id = $9
      `;
        insertQuery = `
       INSERT INTO profile 
(user_id, username, age, gender, date_of_birth,  
 address, emergency_contact, core_qualifications, education) 
VALUES ( $9, $1, $2, $3, $4, $5, $6, $7, $8)
 
      `;
        queryParams = [
          username,
          ageValue,
          gender,
          date_of_birth,

          address,
          emergency_contact,
          core_qualifications,
          education,
          userId,
        ];
      } else {
        updateQuery = `
       UPDATE profile 
    SET username = $1, age = $2, gender = $3, date_of_birth = $4, 
        address = $5, emergency_contact = $6, 
        core_qualifications = $7, education = $8, profile_image = $9 
    WHERE user_id = $10
      `;
        insertQuery = `
        INSERT INTO profile 
    (user_id, username, age, gender, date_of_birth, 
     address, emergency_contact, core_qualifications, education, profile_image) 
    VALUES ($10, $1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
        queryParams = [
          username,
          ageValue,
          gender,
          date_of_birth,

          address,
          emergency_contact,
          core_qualifications,
          education,
          profileImageData,
          userId,
        ];
      }
    } else if (userRole === "2") {
      // For community organizer profile users
      profileTable = "co_profile";
      if (profileImagePath === null) {
        updateQuery = `
        UPDATE co_profile SET username = $1, age = $2, gender = $3,  date_of_birth = $4, 
        address = $5, emergency_contact = $6, organizer_details = $7 WHERE user_id = $8
      `;
        insertQuery = `
        INSERT INTO co_profile (user_id, username, age, gender, date_of_birth, 
        address, emergency_contact, organizer_details) VALUES ($8, $1, $2, $3, $4, $5, $6, $7)
      `;
        queryParams = [
          username,
          ageValue,
          gender,
          date_of_birth,
          address,
          emergency_contact,
          organizer_details,
          userId,
        ];
      } else {
        updateQuery = `
        UPDATE co_profile SET username = $1, age = $2, gender = $3, date_of_birth = $4, 
        address = $5, emergency_contact = $6, organizer_details = $7, profile_image = $8 WHERE user_id = $9
      `;
        insertQuery = `
        INSERT INTO co_profile (user_id, username, age, gender, date_of_birth, 
        address, emergency_contact, organizer_details, profile_image) VALUES ($9, $1, $2, $3, $4, $5, $6, $7, $8)
      `;
        queryParams = [
          username,
          ageValue,
          gender,
          date_of_birth,
          address,
          emergency_contact,
          organizer_details,
          profileImageData,
          userId,
        ];
      }
    } else if (userRole === "3") {
      // For healthcare provider profile users
      profileTable = "hp_profile";
      if (profileImagePath === null) {
        updateQuery = `
      UPDATE hp_profile SET username = $1, age = $2, gender = $3, 
      date_of_birth = $4, email = $5, address = $6, emergency_contact = $7, 
      summary = $8, education = $9, credentials = $10, languages = $11, services = $12, 
      business_hours = $13, business_days = $14, experience = $15, specialist = $16, 
      hospital = $17 WHERE user_id = $18
    `;

        // Modify the insert query to exclude identification_card_number
        insertQuery = `
      INSERT INTO hp_profile (user_id, username, age, gender, date_of_birth, email, address, emergency_contact, summary, education, credentials, 
      languages, services, business_hours, business_days, experience, specialist, hospital) 
      VALUES 
      ( $18, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;

        queryParams = [
          username,
          ageValue,
          gender,
          date_of_birth,
          email,
          address,
          emergency_contact,
          summary,
          education,
          credentials,
          languages,
          services,
          business_hours,
          business_days,
          experience,
          specialist,
          hospital,
          // profileImageData, // Binary data of profile image
          // profileImagePath,
          userId,
        ];
      } else {
        updateQuery = `
      UPDATE hp_profile SET username = $1, age = $2, gender = $3, 
      date_of_birth = $4,  email = $5, address = $6, emergency_contact = $7, 
      summary = $8, education = $9, credentials = $10, languages = $11, services = $12, 
      business_hours = $13, business_days = $14, experience = $15, specialist = $16, 
      hospital = $17, profile_image = $18 WHERE user_id = $19
    `;

        // Modify the insert query to exclude identification_card_number
        insertQuery = `
      INSERT INTO hp_profile (user_id, username, age, gender, date_of_birth, 
       email, address, emergency_contact, summary, education, credentials, 
      languages, services, business_hours, business_days, experience, specialist, hospital, profile_image) 
      VALUES 
      ( $19, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `;

        queryParams = [
          username,
          ageValue,
          gender,
          date_of_birth,
          email,
          address,
          emergency_contact,
          summary,
          education,
          credentials,
          languages,
          services,
          business_hours,
          business_days,
          experience,
          specialist,
          hospital,
          profileImageData, // Binary data of profile image
          // profileImagePath,
          userId,
        ];
      }
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

    // Check if profile entry exists
    const checkProfileQuery = `SELECT * FROM ${profileTable} WHERE user_id = $1`;
    const profileResult = await pool.query(checkProfileQuery, [userId]);

    console.log("Query Result:", profileResult.rows);

    if (profileResult.rows.length > 0) {
      // Update existing profile data
      await pool.query(updateQuery, queryParams);
      console.log("Query:", updateQuery);
      console.log("Parameters:", queryParams);
    } else {
      console.log("Query:", insertQuery);
      console.log("Parameters:", queryParams);
      // Insert new profile data
      await pool.query(
        insertQuery,
        queryParams
        // [userId, ...queryParams]
        // queryParams
      );
    }

    // Update users table with common fields
    await pool.query(
      "UPDATE users SET phone_no = $1, email = $2 WHERE id = $3",
      [phone_number || "", email || "", userId]
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Profile update failed" });
  }
};

const deleteAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verify user exists
    const userQuery = "SELECT role FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userRole = userResult.rows[0].role;

    let profileTable;
    if (userRole === "1" || userRole === "4") {
      profileTable = "profile";
    } else if (userRole === "2") {
      profileTable = "co_profile";
    } else if (userRole === "3") {
      profileTable = "hp_profile";
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

    // Delete profile data
    const deleteProfileQuery = `DELETE FROM ${profileTable} WHERE user_id = $1`;
    await pool.query(deleteProfileQuery, [userId]);

    // Delete user account
    const deleteUserQuery = "DELETE FROM users WHERE id = $1";
    await pool.query(deleteUserQuery, [userId]);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

module.exports = { getHpProfile, updateHpProfile, upload, deleteAccount };
