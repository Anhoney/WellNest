const express = require("express");
const {
  sendMessage,
  getChatHistory,
  startVideoCall,
  getOngoingVideoCalls,
} = require("../controllers/chatController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/messages", protect, sendMessage);
router.get("/history/:userId", protect, getChatHistory);
router.post("/video-call", protect, startVideoCall);
router.get("/video-calls", protect, getOngoingVideoCalls);

module.exports = router;
