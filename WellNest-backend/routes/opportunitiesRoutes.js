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

module.exports = router;
