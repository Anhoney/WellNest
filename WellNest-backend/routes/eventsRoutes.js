// routes/eventsRoute.js
const express = require("express");
const router = express.Router();
const {
  createEvent,
  upload,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventsByUserId,
} = require("../controllers/eventsController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to create a new event
router.post(
  "/events/:co_id",
  authenticateToken,
  upload.single("photo"),
  createEvent
);

// Route to get event details by ID
router.get("/events/:event_id", authenticateToken, getEvent);

// Route to update event by ID
router.put("/events/:event_id", authenticateToken, updateEvent);

// Route to delete event by ID
router.delete("/events/:event_id", authenticateToken, deleteEvent);

router.get("/get/events/:co_id", authenticateToken, getEventsByUserId);
module.exports = router;
