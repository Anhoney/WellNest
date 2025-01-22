// routes/supportGroupRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addSupportGroupUser,
  deleteSupportGroupUser,
  getAllSupportGroupUserByGroupId,
  getAllSupportGroupByUserId,
} = require("../controllers/supportGroupUserController");
const authenticateToken = require("../middleware/authMiddleware");

router.get(
  "/support_group_user/:group_id",
  authenticateToken,
  getAllSupportGroupUserByGroupId
);

router.post("/support_group_user/", authenticateToken, addSupportGroupUser);

router.delete(
  "/support_group_user/",
  authenticateToken,
  deleteSupportGroupUser
);

// router.get(
//   "/support_group_user/:user_id",
//   authenticateToken,
//   getAllSupportGroupByUserId
// );

module.exports = router;
