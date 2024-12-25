//notificationRoutes.js
const express = require("express");
const cron = require("node-cron");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// // Define Routes
// router.post(
//   "/trigger-notification",
//   notificationController.triggerNotification
// );
router.get("/notifications/:userId", notificationController.getNotifications);
router.put(
  "/notifications/mark-as-read",
  notificationController.markNotificationsAsRead
);
router.get(
  "/notifications/unread-count/:userId",
  notificationController.countNotification
);

// Schedule the job to run every hour
// cron.schedule("0 * * * *", () => {
//   console.log("Checking for upcoming appointments...");
//   checkUpcomingAppointments();
// });

module.exports = router;
