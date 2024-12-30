// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByPhoneNo } = require("../models/userModel");
const pool = require("../config/db");

const loginUser = async (req, res) => {
  console.log("Login attempt with phone number:", req.body.phoneNo); // Debug log
  const { phoneNo, password } = req.body;
  // console.log(phoneNo)
  // console.log(password)

  try {
    const user = await findUserByPhoneNo(phoneNo);
    console.log("Fetched user:", user); // Debug log
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ error: "Invalid password" });

    // Create a JWT token with the user's ID and role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    console.log("Generated token:", token); // Debug log
    res.json({
      message: "Login successful",
      token,
      userId: user.id,
      role: user.role,
      full_name: user.full_name,
    });

    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Both old and new passwords are required" });
  }

  try {
    // Fetch user's current password hash
    const userQuery = "SELECT password FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentPasswordHash = userResult.rows[0].password;

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, currentPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const updateQuery = "UPDATE users SET password = $1 WHERE id = $2";
    await pool.query(updateQuery, [newPasswordHash, userId]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

module.exports = {
  loginUser,
  changePassword,
};
