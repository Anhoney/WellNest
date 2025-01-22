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

router.get("/get/support_group/", authenticateToken, getAllSupportGroup);

router.get(
  "/getSingle/support_group/:support_group_id/",
  authenticateToken,
  getSupportGroup
);

router.get(
  "/get/support_group/:user_id/",
  authenticateToken,
  getSupportGroupByUserId
);

router.get(
  "/getCo/support_group/:co_id/",
  authenticateToken,
  getSupportGroupByCoId
);

router.patch(
  "/support_group/:support_group_id",
  authenticateToken,
  upload.single("groupImage"),
  updateSupportGroup
);

router.delete(
  "/support_group/:support_group_id",
  authenticateToken,
  deleteSupportGroup
);

router.get(
  "/getUnjoin/support_group/:userId/",
  authenticateToken,
  getAllUnjoinedSupportGroup
);

module.exports = router;
