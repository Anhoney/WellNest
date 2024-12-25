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

// router.delete("/appointments/:id", authenticateToken, deleteAppointment);
router.post("/medical-reports", createOrUpdateMedicalReport);

router.get(
  "/medicalReports/:appointment_id",
  authenticateToken,
  getMedicalReport
);
router.delete("/medicalReports/delete/:appointment_id", deleteMedicalReport);
router.get(
  "/medicalReports/check/:hpva_id/:appointment_type",
  checkMedicalReportExists
);

router.get(
  "/user/medicalReports/:userId",
  authenticateToken,
  getUserMedicalReports
);

module.exports = router;
