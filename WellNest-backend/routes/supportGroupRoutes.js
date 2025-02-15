// routes/supportGroupRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createSupportGroup,
  getSupportGroup,
  getAllSupportGroup,
  getSupportGroupByUserId,
  updateSupportGroup,
  deleteSupportGroup,
  getSupportGroupByCoId,
  getAllUnjoinedSupportGroup,
} = require("../controllers/supportGroupController");
const authenticateToken = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" }); // Set the destination for uploaded files

// Route to create a new support group
router.post(
  "/support_group/",
  authenticateToken,
  upload.single("groupImage"),
  createSupportGroup
);

// Route to get all support groups
router.get("/get/support_group/", authenticateToken, getAllSupportGroup);

// Route to get a specific support group by its ID
router.get(
  "/getSingle/support_group/:support_group_id/",
  authenticateToken,
  getSupportGroup
);

// Route to get all support groups that a user has joined by user ID
router.get(
  "/get/support_group/:user_id/",
  authenticateToken,
  getSupportGroupByUserId
);

// Route to get all support groups under a specific company by company ID
router.get(
  "/getCo/support_group/:co_id/",
  authenticateToken,
  getSupportGroupByCoId
);

// Route to update support group details, including an updated group image
router.patch(
  "/support_group/:support_group_id",
  authenticateToken,
  upload.single("groupImage"),
  updateSupportGroup
);

// Route to delete a support group by its ID
router.delete(
  "/support_group/:support_group_id",
  authenticateToken,
  deleteSupportGroup
);

// Route to get all support groups that a user has not joined
router.get(
  "/getUnjoin/support_group/:userId/",
  authenticateToken,
  getAllUnjoinedSupportGroup
);

module.exports = router;
