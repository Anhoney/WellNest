const express = require("express");
const router = express.Router();
const {
  createAssessment,
  upload,
  getAssessmentsByCoId,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  createAssessmentResults,
  getAssessmentResultsById,
  updateAssessmentResults,
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

// Route to update an existing assessment
router.put(
  "/edit/assessments/:assessmentId",
  authenticateToken,
  updateAssessment
);
router.delete(
  "/delete/assessment/:assessmentId",
  authenticateToken,
  deleteAssessment
);

// Route to create overall scores and results for an assessment
router.post(
  "/assessments/:assessmentId/results",
  authenticateToken,
  createAssessmentResults
);

// Route to fetch assessment results
router.get(
  "/assessments/:assessmentId/results",
  authenticateToken,
  getAssessmentResultsById
);

// Route to update assessment results
router.put(
  "/assessments/:assessmentId/results",
  authenticateToken,
  updateAssessmentResults
);

module.exports = router;
