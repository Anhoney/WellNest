// routes/registerRoute.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db"); // Import the database connection
const router = express.Router();
const { registerUser } = require("../controllers/registerController");

router.post("/register", registerUser);

module.exports = router;
