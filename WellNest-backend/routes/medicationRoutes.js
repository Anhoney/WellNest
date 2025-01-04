// routes/medicationRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createReminder,
  getMedications,
  updateReminder,
  getMedicationById,
  deleteReminder,
  updateMedicationStatus,
  getMedicationsByStatus,
  updateMedicationStatusCompleted,
  stopAlarm,
  snoozeAlarm,
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

router.put(
  "/user/medication/:medicationId",
  authenticateToken,
  upload.single("medicineImage"),
  updateReminder
);
router.get("/get/medication/:userId", authenticateToken, getMedications);
// routes/medicationRoutes.js
router.get(
  "/getSingle/medication/:medicationId",
  authenticateToken,
  getMedicationById
);
router.delete(
  "/delete/medication/:medicationId",
  authenticateToken,
  deleteReminder
);

router.patch("/update-status/:medicationId", updateMedicationStatus);

//Alarm
// Fetch all medications
router.get("/get/medications", getMedicationsByStatus);

// Update medication status
router.put("/medications/:id/status", updateMedicationStatusCompleted);

router.post("/stop-alarm", stopAlarm);
router.post("/snooze-alarm", snoozeAlarm);

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
