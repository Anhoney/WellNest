// routes/supportGroupRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addSupportGroupUser,
  deleteSupportGroupUser,
  getAllSupportGroupUserByGroupId,
} = require("../controllers/supportGroupUserController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to get all users in a specific support group by group ID
router.get(
  "/support_group_user/:group_id",
  authenticateToken,
  getAllSupportGroupUserByGroupId
);

// Route to add a user to a support group
router.post("/support_group_user/", authenticateToken, addSupportGroupUser);

// Route to remove a user from a support group
router.delete(
  "/support_group_user/",
  authenticateToken,
  deleteSupportGroupUser
);

module.exports = router;
