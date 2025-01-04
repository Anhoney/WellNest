// routes/authRoutes.js
const express = require("express");
const { loginUser, changePassword } = require("../controllers/authController");
const router = express.Router();

router.post("/login", loginUser);
router.post("/changePassword/:userId", changePassword);

module.exports = router;
