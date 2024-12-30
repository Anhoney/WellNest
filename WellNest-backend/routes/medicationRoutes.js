// routes/medicationRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createReminder,
  getMedications,
  //   createOrUpdateMedicalReport,
  //   getMedicalReport,
  //   deleteMedicalReport,
  //   checkMedicalReportExists,
  //   getUserMedicalReports,
} = require("../controllers/medicationController");
const authenticateToken = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" }); // Set the destination for uploaded files
// router.delete("/appointments/:id", authenticateToken, deleteAppointment);
router.post(
  "/medication",
  authenticateToken,
  upload.single("medicineImage"),
  createReminder
);
router.get("/get/medication/:userId", authenticateToken, getMedications);
// router.get(
//   "/medicalReports/:appointment_id",
//   authenticateToken,
//   getMedicalReport
// );
// router.delete("/medicalReports/delete/:appointment_id", deleteMedicalReport);
// router.get(
//   "/medicalReports/check/:hpva_id/:appointment_type",
//   checkMedicalReportExists
// );

// router.get(
//   "/user/medicalReports/:userId",
//   authenticateToken,
//   getUserMedicalReports
// );

module.exports = router;
