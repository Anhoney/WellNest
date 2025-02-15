// routes/appointmentsRoute.js
const express = require("express");
const router = express.Router();
const {
  createOrUpdateMedicalReport,
  getMedicalReport,
  deleteMedicalReport,
  checkMedicalReportExists,
  getUserMedicalReports,
} = require("../controllers/medicalReportController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to create or update a medical report
router.post("/medical-reports", createOrUpdateMedicalReport);

// Route to retrieve a medical report by appointment ID
router.get(
  "/medicalReports/:appointment_id",
  authenticateToken,
  getMedicalReport
);

// Route to delete a medical report by appointment ID
router.delete("/medicalReports/delete/:appointment_id", deleteMedicalReport);

// Route to check if a medical report exists for a given HPVA ID and appointment type
router.get(
  "/medicalReports/check/:hpva_id/:appointment_type",
  checkMedicalReportExists
);

// Route to get all medical reports for a specific user
router.get(
  "/user/medicalReports/:userId",
  authenticateToken,
  getUserMedicalReports
);

module.exports = router;
