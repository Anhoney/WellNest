// routes/appointmentsRoute.js
const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointment,
  getSingleAppointment,
  getUpcomingAppointments,
  approveAppointment,
  getAppointmentDetailsByHpAppId,
  deleteSingleAppointment,
  getPastAppointments,
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

// Fetch upcoming appointments for a healthcare provider
router.get("/getUpcomingAppointment/:hpId", getUpcomingAppointments);

// Approve an appointment
router.put("/appointments/approve/:appointmentId", approveAppointment);

// Route to get appointment details by hp_app_id
router.get("/appointment/details/:hp_app_id", getAppointmentDetailsByHpAppId);

router.delete(
  "/appointment/delete/:hp_app_id",
  authenticateToken,
  deleteSingleAppointment
);

router.get("/getPastAppointments/:hpId", getPastAppointments);

module.exports = router;
