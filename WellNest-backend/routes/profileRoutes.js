// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const {
  getHpProfile,
  updateHpProfile,
  upload,
  deleteAccount,
} = require("../controllers/profileController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to get a user's profile by user ID
router.get("/profile/:userId", authenticateToken, getHpProfile);

// PUT update profile data including image upload
router.put(
  "/profile/:userId",
  authenticateToken,
  upload.single("profile_image"),
  updateHpProfile
);

// Route to delete a user account
router.delete("/deleteAccount/:userId", deleteAccount);

module.exports = router;
