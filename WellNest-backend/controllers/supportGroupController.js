// supportGroupController.js
const pool = require("../config/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { API_BASE_URL } = require("../config/config");

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
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

// Create a Multer instance for handling file uploads
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
    cb(new Error("Only image files are allowed!"), false); // Reject files that do not match the allowed types
  },
}); // Define upload but do not call .single here

// Create a new support group
const createSupportGroup = async (req, res) => {
  const { co_id, group_name } = req.body;

  let groupImage = ""; // Initialize variable for group image
  if (req.file) {
    groupImage = `${API_BASE_URL}/uploads/${req.file.filename}`;
  }

  try {
    // Insert the new support group into the database
    const query = await pool.query(
      ` INSERT INTO support_group (co_id, group_name, group_photo) VALUES ($1, $2, $3) `,
      [co_id, group_name, groupImage]
    );

    res.status(201).json({ message: "Support Group created successfully!" });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create support group" });
  }
};

// Fetch details of a specific support group by ID
const getSupportGroup = async (req, res) => {
  const { support_group_id } = req.params;
  const query = `
    SELECT 
    id,
    co_id,
    group_name,
    group_photo
    FROM support_group
    WHERE id = $1;
    `;

  try {
    const result = await pool.query(query, [support_group_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Support Group not found." });
    }
    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching support group:", error.message);
    res.status(500).json({ error: "Failed to fetch support group." });
  }
};

// Fetch all support groups created by a specific community organizer
const getSupportGroupByCoId = async (req, res) => {
  const { co_id } = req.params;
  const query = `
    SELECT 
    id,
    co_id,
    group_name,
    group_photo
    FROM support_group
    WHERE co_id = $1;
    `;

  try {
    const result = await pool.query(query, [co_id]);
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching support group:", error.message);
    res.status(500).json({ error: "Failed to fetch support group." });
  }
};

// Fetch all support groups
const getAllSupportGroup = async (req, res) => {
  const query = `
    SELECT 
        id,
        co_id,
        group_name,
        group_photo
    FROM 
        support_group
    ORDER BY 
        id;
    `;

  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Support Group not found." });
    }
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching support group:", error.message);
    res.status(500).json({ error: "Failed to fetch support group." });
  }
};

// Fetch support groups that a specific user is part of
const getSupportGroupByUserId = async (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
    sgu.id AS support_group_user_id,
    sgu.group_id,
    sg.co_id,
    sg.group_name,
    sg.group_photo,
    sgu.join_date
    FROM 
        support_group_user sgu
    JOIN 
        support_group sg ON sgu.group_id = sg.id
    WHERE 
    sgu.user_id = $1;
    `;
  try {
    const result = await pool.query(query, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Support Group not found." });
    }
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching support group:", error.message);
    res.status(500).json({ error: "Failed to fetch support group." });
  }
};

// Update an existing support group
const updateSupportGroup = async (req, res) => {
  const { co_id, group_name } = req.body;

  const { support_group_id } = req.params;
  let groupImage = ""; // Initialize variable for group image
  if (req.file) {
    groupImage = `${API_BASE_URL}/uploads/${req.file.filename}`;
  }

  const query = `
    UPDATE support_group SET co_id = $1, group_name = $2, group_photo = $3 WHERE id = $4 RETURNING *;
    `;

  try {
    const result = await pool.query(query, [
      co_id,
      group_name,
      groupImage,
      support_group_id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Support Group not found." });
    }
    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error updating support group:", error.message);
    res.status(500).json({ error: "Failed to update support group." });
  }
};

// Delete a support group
const deleteSupportGroup = async (req, res) => {
  const { support_group_id } = req.params;

  const query = `
      DELETE FROM support_group WHERE id = $1 RETURNING *
  `;

  try {
    const result = await pool.query(query, [support_group_id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Support Group not found or already deleted" });
    }
    res.status(200).json({
      message: "Support Group deleted successfully",
      support_group: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting support group:", error.message);
    res.status(500).json({ error: "Failed to delete support group." });
  }
};

// Get all unjoined support groups for a specific user
const getAllUnjoinedSupportGroup = async (req, res) => {
  const { userId } = req.params;
  const query = `
     SELECT 
        sg.id,
        sg.co_id,
        sg.group_name,
        sg.group_photo
      FROM 
        support_group sg
      WHERE 
        sg.id NOT IN (
            SELECT group_id 
            FROM support_group_user 
            WHERE user_id = $1
        )
      ORDER BY 
          sg.id;
    `;

  try {
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No available support groups found." });
    }
    res.status(200).json(result.rows); // Return the fetched support groups
  } catch (error) {
    console.error("Error fetching support groups:", error.message);
    res.status(500).json({ error: "Failed to fetch support groups." });
  }
};

module.exports = {
  createSupportGroup,
  getSupportGroup,
  getAllSupportGroup,
  getSupportGroupByUserId,
  updateSupportGroup,
  deleteSupportGroup,
  getSupportGroupByCoId,
  getAllUnjoinedSupportGroup,
};
