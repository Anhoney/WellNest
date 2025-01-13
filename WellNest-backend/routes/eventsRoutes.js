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
  getEventsElderlySite,
  getRegisteredEventsByUserId,
  archiveEvent,
  getPastEventsByUserId,
  unarchiveEvent,
  checkEventRegistration,
  deleteParticipant,
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
  "/events/:event_id/register",
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

router.get("/user/getEvents", authenticateToken, getEventsElderlySite);

router.get(
  "/user/:user_id/registered-events",
  authenticateToken,
  getRegisteredEventsByUserId
);
router.patch("/user/:user_id/archive-event/:event_id", archiveEvent);
router.get("/user/:user_id/past-events", getPastEventsByUserId);
router.patch("/user/:user_id/unarchive-event/:event_id", unarchiveEvent);

router.get(
  "/user/:user_id/event/:event_id/registration",
  authenticateToken,
  checkEventRegistration
);
router.delete(
  "/events/:event_id/participants/:user_id", // Route to delete a participant by ID
  authenticateToken,
  deleteParticipant
);

module.exports = router;
