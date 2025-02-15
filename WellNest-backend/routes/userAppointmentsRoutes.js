// routes/userAppointmentsRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  searchDoctors,
  getAvailableTimes,
  bookAppointment,
  getCategories,
  getDoctorsByCategory,
  addRating,
  getDoctorAppointmentDetails,
  getScheduledAppointments,
  cancelAppointment,
  getAppointmentDetails,
  searchVirtualDoctors,
  getVirtualCategories,
  getVirtualDoctorsByCategory,
  getVirtualDoctorAppointmentDetails,
  getVirtualAvailableTimes,
  bookVirtualAppointment,
  uploadReceipt,
  getVirtualAppointmentDetails,
} = require("../controllers/userAppointmentsController");
const authenticateToken = require("../middleware/authMiddleware"); // Import authentication middleware

// Set up multer for file uploads (used for uploading receipts)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  },
});

const upload = multer({ storage });

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

// Route to get details of a specific doctor
router.get("/doctor/:doctorId", getDoctorAppointmentDetails);

// Get appointments for a user
router.get("/getScheduledAppointments/:userId", getScheduledAppointments);

// Cancel appointment
router.delete("/cancelAppointment/:appointmentId", cancelAppointment);

// Route to get details of a specific appointment
router.get("/getAppointmentDetails/:appointmentId", getAppointmentDetails);

// Route for searching virtual doctors
router.post("/searchVirtualDoctors", searchVirtualDoctors);

// Route to get virtual doctor categories
router.get("/virtualCategories", getVirtualCategories);

// Route to search for doctors by virtual category
router.get("/searchByVirtualCategory", getVirtualDoctorsByCategory);

// Route to get details of a virtual doctor
router.get("/virtual/doctor/:doctorId", getVirtualDoctorAppointmentDetails);

// Route to get available times for a virtual doctor
router.get("/virtual/availableTimes", getVirtualAvailableTimes);

// Route to book a virtual appointment (requires authentication)
router.post(
  "/virtual/bookAppointment",
  authenticateToken,
  bookVirtualAppointment
);

// Route for uploading receipts
router.post(
  "/uploadReceipt",
  authenticateToken,
  upload.single("file"),
  uploadReceipt
);

// Route to get details of a virtual appointment
router.get(
  "/getVirtualAppointmentDetails/:appointmentId",
  getVirtualAppointmentDetails
);

module.exports = router;
