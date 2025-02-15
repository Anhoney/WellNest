// routes/authRoutes.js
const express = require("express");
const { loginUser, changePassword } = require("../controllers/authController");
const router = express.Router();

// Route to log in a user
router.post("/login", loginUser);

// Route to change the password for a specific user
router.post("/changePassword/:userId", changePassword);

module.exports = router;
