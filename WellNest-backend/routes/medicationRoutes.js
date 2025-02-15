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

// Configure multer for handling file uploads (medicine images)
const upload = multer({ dest: "uploads/" }); // Set the destination for uploaded files

// Route to create a new medication reminder
router.post(
  "/medication",
  authenticateToken,
  upload.single("medicineImage"),
  createReminder
);

// Route to update an existing medication reminder by medication ID
router.put(
  "/user/medication/:medicationId",
  authenticateToken,
  upload.single("medicineImage"),
  updateReminder
);

// Route to get all medications for a specific user by user ID
router.get("/get/medication/:userId", authenticateToken, getMedications);

// Route to fetch a single medication by medication ID
router.get(
  "/getSingle/medication/:medicationId",
  authenticateToken,
  getMedicationById
);

// Route to delete a medication reminder by medication ID
router.delete(
  "/delete/medication/:medicationId",
  authenticateToken,
  deleteReminder
);

// Route to update the status of a medication by medication ID
router.patch("/update-status/:medicationId", updateMedicationStatus);

// Route to fetch medications based on their status (e.g., pending, completed)
router.get("/get/medications", getMedicationsByStatus);

// Update medication status
router.put("/medications/:id/status", updateMedicationStatusCompleted);

// Route to stop a medication alarm
router.post("/stop-alarm", stopAlarm);

// Route to snooze a medication alarm for a specified duration
router.post("/snooze-alarm", snoozeAlarm);

module.exports = router;
