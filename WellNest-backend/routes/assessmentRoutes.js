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
  getAllAssessments,
  getAssessmentQuestionsAndAnswers,
  calculateTotalMarksAndFetchResult,
  saveAssessmentResults,
  getAssessmentHistory,
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

router.get("/user/allAssessments", authenticateToken, getAllAssessments);

// Route to fetch questions and answers for a specific assessment
router.get(
  "/assessments/:assessmentId/questions",
  authenticateToken,
  getAssessmentQuestionsAndAnswers
);

// Route to calculate total marks and fetch result
router.post(
  "/assessments/:assessmentId/submit",
  authenticateToken,
  calculateTotalMarksAndFetchResult
);

// Route to save assessment results
router.post(
  "/assessments/:assessmentId/results/save",
  authenticateToken,
  saveAssessmentResults
);

// Route to get assessment history for a user
router.get(
  "/assessments/history/:userId",
  authenticateToken,
  getAssessmentHistory
);

module.exports = router;
