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
  addParticipantToEvent,
  getEventParticipants,
  getParticipantCount,
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
router.get("/single/event/:event_id", authenticateToken, getEvent);

// Route to update event by ID
router.put(
  "/update/events/:event_id",
  authenticateToken,
  upload.single("photo"),
  updateEvent
);

// Route to delete event by ID
router.delete("/events/:event_id", authenticateToken, deleteEvent);

router.get("/get/events/:co_id", authenticateToken, getEventsByUserId);

// Add participant to an event
router.post(
  "/events/:event_id/participants",
  authenticateToken,
  addParticipantToEvent
);

// Get participants for an event
router.get(
  "/events/:event_id/participants",
  authenticateToken,
  getEventParticipants
);

// Get participant count for an event
router.get(
  "/events/:event_id/participants/count",
  authenticateToken,
  getParticipantCount
);

module.exports = router;
