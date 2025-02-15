// routes/notificationRoutes.js
const express = require("express");
const cron = require("node-cron");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Route to fetch all notifications for a specific user by user ID
router.get("/notifications/:userId", notificationController.getNotifications);

// Route to mark all notifications as read
router.put(
  "/notifications/mark-as-read",
  notificationController.markNotificationsAsRead
);

// Route to get the count of unread notifications for a specific user
router.get(
  "/notifications/unread-count/:userId",
  notificationController.countNotification
);

module.exports = router;
