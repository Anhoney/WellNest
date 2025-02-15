// routes/usersRoute.js
const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/usersController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to get all users (Requires authentication)
router.get("/users/", authenticateToken, getAllUsers);

module.exports = router;
