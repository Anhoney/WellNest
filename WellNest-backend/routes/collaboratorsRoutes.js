// routes/collaboratorsRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCollaborationRequest,
  getCollaborationRequests,
  getAllAcceptedCollaborations,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
  getUserDetailsForCollaboration,
  getCaregiverInformation,
  deleteCollaboration,
  getPendingCollaborationRequests,
} = require("../controllers/collaboratorsController"); // Ensure this is a direct import
const authenticateToken = require("../middleware/authMiddleware");

// Create a new collaboration request
router.post("/create/request", authenticateToken, createCollaborationRequest);

// Get collaboration requests for a user
router.get(
  "/get/requests/:userId",
  authenticateToken,
  getCollaborationRequests
);

// Accept a collaboration request
router.put(
  "/update/accepted/:collabId",
  authenticateToken,
  acceptCollaborationRequest
);

// Decline a collaboration request
router.put("/:collabId/decline", authenticateToken, rejectCollaborationRequest);

// Get all accepted collaborations for a user
router.get(
  "/get/accepted/:userId",
  authenticateToken,
  getAllAcceptedCollaborations
);

// Route to get user details for collaboration
router.get(
  "/user/details/:userToCollabId",
  authenticateToken,
  getUserDetailsForCollaboration
);

// Route to get caregiver information
router.get(
  "/get/caregiver/details/:caregiverId",
  authenticateToken,
  getCaregiverInformation
);

// Delete a collaboration
router.delete(
  "/delete/collaboration/:collabId",
  authenticateToken,
  deleteCollaboration
);

// Get pending collaboration requests for a user
router.get(
  "/pending/requests/:userId",
  authenticateToken,
  getPendingCollaborationRequests
);

module.exports = router;
