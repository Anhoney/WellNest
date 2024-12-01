// const express = require("express");
// const router = express.Router();
// const userAppointmentsController = require("../controllers/userAppointmentsController");

// // Route for searching doctors
// router.post("/search", userAppointmentsController.searchDoctors);

// // Route for getting available times for a doctor
// router.get("/availableTimes", userAppointmentsController.getAvailableTimes);

// // Route for booking an appointment
// router.post("/book", userAppointmentsController.bookAppointment);

// module.exports = router;

//userAppointmentsRoutes.js
const express = require("express");
const router = express.Router();
const {
  searchDoctors,
  getAvailableTimes,
  bookAppointment,
  getCategories, // Export the new function
  getDoctorsByCategory,
  addRating,
  getDoctorAppointmentDetails,
  getScheduledAppointments,
  cancelAppointment,
  getAppointmentDetails,
} = require("../controllers/userAppointmentsController");
const authenticateToken = require("../middleware/authMiddleware"); // Import authentication middleware

// Route for searching doctors (public or authenticated, depending on requirements)
router.post("/search", searchDoctors);

// Route for getting available times for a doctor (no need for user-specific authentication here)
router.get("/availableTimes", getAvailableTimes);

// Route for booking an appointment (requires user authentication)
router.post("/bookAppointment", authenticateToken, bookAppointment);

// Route for fetching unique categories
router.get("/categories", getCategories); // New route for categories

// Add new route
router.get("/searchByCategory", getDoctorsByCategory);

// Add the route for adding ratings
router.post("/addRating", addRating);

router.get("/doctor/:doctorId", getDoctorAppointmentDetails);

// Get appointments for a user
router.get("/getScheduledAppointments/:userId", getScheduledAppointments);

// Cancel appointment
router.delete("/cancelAppointment/:appointmentId", cancelAppointment);

router.get("/getAppointmentDetails/:appointmentId", getAppointmentDetails);

module.exports = router;
