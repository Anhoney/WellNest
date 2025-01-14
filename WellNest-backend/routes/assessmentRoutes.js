const express = require("express");
const router = express.Router();
const {
  createAssessment,
  upload,
  getAssessmentsByCoId,
  getAssessmentById,
} = require("../controllers/assessmentController"); // Ensure this is a direct import
const authenticateToken = require("../middleware/authMiddleware");

// Route to create a new assessment
router.post(
  "/assessments/:co_id",
  authenticateToken,
  upload.single("photo"),
  createAssessment
); // Pass `createAssessment` as the callback

// Route to get assessments by co_id
router.get("/get/assessments/:co_id", authenticateToken, getAssessmentsByCoId);

router.get(
  "/single/assessment/:assessmentId",
  authenticateToken,
  getAssessmentById
);

module.exports = router;
