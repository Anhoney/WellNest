// routes/opportunitysRoute.js
const express = require("express");
const router = express.Router();
const {
  createOpportunity,
  upload,
  getOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunitiesByUserId,
  addParticipantToOpportunity,
  getOpportunityParticipants,
  getParticipantCount,
  getOpportunitiesElderlySite,
  getRegisteredOpportunitiesByUserId,
  archiveOpportunity,
  getPastOpportunitiesByUserId,
  unarchiveOpportunity,
  checkOpportunityRegistration,
  deleteParticipant,
} = require("../controllers/opportunitiesController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to create a new opportunity
router.post(
  "/opportunities/:co_id",
  authenticateToken,
  upload.single("photo"),
  createOpportunity
);

// Route to get opportunity details by ID
router.get(
  "/single/opportunity/:opportunity_id",
  authenticateToken,
  getOpportunity
);

// Route to update opportunity by ID
router.put(
  "/update/opportunities/:opportunity_id",
  authenticateToken,
  upload.single("photo"),
  updateOpportunity
);

// Route to delete opportunity by ID
router.delete(
  "/opportunities/:opportunity_id",
  authenticateToken,
  deleteOpportunity
);

// Route to get all opportunities for a specific user (by co_id)
router.get(
  "/get/opportunities/:co_id",
  authenticateToken,
  getOpportunitiesByUserId
);

// Add participant to an opportunity
router.post(
  "/opportunities/:opportunity_id/participants",
  authenticateToken,
  addParticipantToOpportunity
);

// Get participants for an opportunity
router.get(
  "/opportunities/:opportunity_id/participants",
  authenticateToken,
  getOpportunityParticipants
);

// Get participant count for an opportunity
router.get(
  "/opportunities/:opportunity_id/participants/count",
  authenticateToken,
  getParticipantCount
);

// Route to get all available opportunities for elderly users
router.get(
  "/user/getOpportunities",
  authenticateToken,
  getOpportunitiesElderlySite
);

// Route to get all registered opportunities for a user
router.get(
  "/user/:user_id/registered-opportunities",
  authenticateToken,
  getRegisteredOpportunitiesByUserId
);

// Route to archive a specific opportunity
router.patch(
  "/user/:user_id/archive-opportunity/:opportunity_id",
  archiveOpportunity
);

// Route to get past opportunities for a user
router.get("/user/:user_id/past-opportunities", getPastOpportunitiesByUserId);

// Route to unarchive an opportunity
router.patch(
  "/user/:user_id/unarchive-opportunity/:opportunity_id",
  unarchiveOpportunity
);

// Route to check if a user is registered for an opportunity
router.get(
  "/user/:user_id/opportunity/:opportunity_id/registration",
  authenticateToken,
  checkOpportunityRegistration
);

// Route to delete a participant from an opportunity by user ID
router.delete(
  "/opportunities/:opportunity_id/participants/:user_id", // Route to delete a participant by ID
  authenticateToken,
  deleteParticipant
);

module.exports = router;
