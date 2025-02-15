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
  getVirtualAvailabilityDetails,
  upsertVirtualConsultation,
  deleteVirtualConsultation,
  getUpcomingVirtualAppointments,
  approveVirtualAppointment,
  updateVirtualAppointmentStatus,
  getVirtualAppointmentDetailsByHpAppId,
  deleteVirtualSingleAppointment,
  getPastVirtualAppointments,
  updateVirtualAppointmentMeetingLink,
} = require("../controllers/appointmentsController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to delete an appointment by ID
router.delete("/appointments/:id", authenticateToken, deleteAppointment);

// Route to update an existing appointment by ID
router.put("/appointments/:id", authenticateToken, updateAppointment);

// Route to create a new appointment
router.post("/appointments", authenticateToken, createAppointment);

// Fetch appointments for a specific user
router.get("/appointments/user/:userId", authenticateToken, getAppointments); // New GET route

// Fetch a single appointment
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

// Route to delete a single appointment by hp_app_id
router.delete(
  "/appointment/delete/:hp_app_id",
  authenticateToken,
  deleteSingleAppointment
);

// Route to fetch past appointments for a healthcare provider by their ID
router.get("/getPastAppointments/:hpId", getPastAppointments);

// Route to fetch virtual availability details for a healthcare provider by their ID
router.get(
  "/virtualAvailabilityDetails/:hpId",
  authenticateToken,
  getVirtualAvailabilityDetails
);

// Route to create or update a virtual consultation
router.post(
  "/virtualConsultation/upsert",
  authenticateToken,
  upsertVirtualConsultation
);

// Route to delete a virtual consultation by ID
router.delete(
  "/virtualConsultation/delete/:id",
  authenticateToken,
  deleteVirtualConsultation
);

// Fetch upcoming appointments for a healthcare provider
router.get(
  "/virtual/getUpcomingAppointment/:hpId",
  getUpcomingVirtualAppointments
);

// Approve an appointment
router.put(
  "/virtual/appointments/approve/:appointmentId",
  approveVirtualAppointment
);

// Update appointment status
router.put(
  "/virtual/appointments/updateStatus/:appointmentId",
  updateVirtualAppointmentStatus
);

// Route to fetch upcoming virtual appointments for a healthcare provider by their ID
router.get(
  "/virtual/appointment/details/:hpva_id",
  getVirtualAppointmentDetailsByHpAppId
);

// Route to delete a virtual appointment by hpva_id
router.delete(
  "/virtual/appointment/delete/:hpva_id",
  authenticateToken,
  deleteVirtualSingleAppointment
);

// Route to fetch past virtual appointments for a healthcare provider by their ID
router.get("/virtual/getPastAppointments/:hpId", getPastVirtualAppointments);

// Route to update the meeting link for a virtual appointment by hpva_id
router.put(
  "/virtual/appointments/updateMeetingLink/:hpva_id",
  updateVirtualAppointmentMeetingLink
);

module.exports = router;
