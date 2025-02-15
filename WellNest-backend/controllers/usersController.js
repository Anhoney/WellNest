// usersController.js
const pool = require("../config/db");

const getAllUsers = async (req, res) => {
  const query = `
    SELECT 
        id,
        full_name,
        phone_no,
        email
    FROM 
        users
    ORDER BY 
        id;
    `;
  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Users not found." });
    }
    res.status(200).json(result.rows); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

module.exports = {
  getAllUsers,
};
