// routes/appointmentsRoute.js
const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointment,
  getSingleAppointment,
} = require("../controllers/appointmentsController");
const authenticateToken = require("../middleware/authMiddleware");

router.delete("/appointments/:id", authenticateToken, deleteAppointment);

router.put("/appointments/:id", authenticateToken, updateAppointment);

// router.post("/appointments", createAppointment);
router.post("/appointments", authenticateToken, createAppointment);

// Fetch appointments for a specific user
router.get("/appointments/user/:userId", authenticateToken, getAppointments); // New GET route

// New route to fetch a single appointment
router.get(
  "/appointments/:appointmentId",
  authenticateToken,
  getSingleAppointment
);

module.exports = router;
