//notificationController.js
const db = require("../config/db");
const { format } = require("date-fns"); // Import date-fns for formatting
// const io = require("../server"); // Import the io instance
// Notify User
const notifyUser = async (
  userId,
  message,
  notificationType,
  notificationTime
) => {
  //   console.log("Notification Type:", notificationType);
  //   console.log("Message:", message);
  //   console.log("User ID:", userId);
  //   const query = `
  //         INSERT INTO notifications (user_id, message, notification_type)
  //         VALUES ($1, $2, $3)
  //     `;
  //   await db.query(query, [userId, message, notificationType]);
  try {
    console.log(
      "Sending notification to user:",
      userId,
      message,
      notificationType
    );
    const query = `
      INSERT INTO notifications (user_id, message, notification_type, is_read, created_at)
      VALUES ($1, $2, $3, FALSE, NOW())
    `;
    await db.query(query, [userId, message, notificationType]);
    console.log("Notification inserted successfully.");
    // Include notification time in the response to the client
    // If you're using WebSocket or similar, emit the data
    const notificationData = {
      userId,
      message,
      type: notificationType,
      time: notificationTime, // Send this to the client
    };

    // For example:
    // io.to(userId).emit("new_notification", notificationData);

    console.log("Notification inserted and emitted successfully.");
  } catch (error) {
    console.error("Error inserting notification:", error);
    throw new Error("Failed to notify user.");
  }
};

// Get Notifications for a User
const getNotifications = async (req, res) => {
  const { userId } = req.params;
  //   console.log("GetNotification Received userId:", userId);
  try {
    const query = `
        SELECT * FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;

    const result = await db.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

// Mark Notifications as Read
const markNotificationsAsRead = async (req, res) => {
  const { notificationIds } = req.body;

  const query = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE notification_id = ANY($1)
    `;

  try {
    await db.query(query, [notificationIds]);
    res.status(200).json({ message: "Notifications marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};

const countNotification = async (req, res) => {
  const { userId } = req.params;

  // console.log("countNotification Received userId:", userId);
  try {
    const { rows } = await db.query(
      `
          SELECT COUNT(*) AS unread_count FROM public.notifications WHERE user_id = $1 AND is_read = false
      `,
      [userId]
    );

    res.status(200).json({ unreadCount: rows[0].unread_count });
  } catch (err) {
    console.error("Error fetching unread notifications count:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch unread notifications count." });
  }
};

// Function to create a notification
const createNotification = async (userId, message) => {
  const query = `
        INSERT INTO public.notifications (user_id, message, is_read, created_at, notification_type)
        VALUES ($1, $2, FALSE, NOW(), 'appointment_reminder')
    `;
  try {
    await db.query(query, [userId, message]);
    console.log("Notification created successfully for user:", userId);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = {
  notifyUser,
  //   triggerNotification,
  getNotifications,
  markNotificationsAsRead,
  countNotification,
  //   checkUpcomingAppointments,
};
