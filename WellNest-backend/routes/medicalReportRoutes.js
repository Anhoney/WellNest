// routes/appointmentsRoute.js
const express = require("express");
const router = express.Router();
const {
  createOrUpdateMedicalReport,
  getMedicalReport,
  deleteMedicalReport,
} = require("../controllers/medicalReportController");
const authenticateToken = require("../middleware/authMiddleware");

// router.delete("/appointments/:id", authenticateToken, deleteAppointment);
router.post("/medical-reports", createOrUpdateMedicalReport);

router.get(
  "/medicalReports/:appointment_id",
  authenticateToken,
  getMedicalReport
);
router.delete("/medicalReports/delete/:appointment_id", deleteMedicalReport);

module.exports = router;
