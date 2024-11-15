// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const {
  getHpProfile,
  updateHpProfile,
  upload,
} = require("../controllers/profileController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/hp-profile/:userId", authenticateToken, getHpProfile);

// router.put("/hp-profile/:userId", authenticateToken, updateHpProfile);
// PUT update profile data including image upload
router.put(
  "/hp-profile/:userId",
  authenticateToken,
  upload.single("profile_image"),
  updateHpProfile
);
// Route to update profile, apply `upload.single` here
// router.post(
//   "/profile/:userId",
//   upload.single("profile_image"), // Apply `single` directly
//   updateHpProfile
// );

module.exports = router;
