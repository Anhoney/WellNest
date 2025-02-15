//notificationController.js
const db = require("../config/db");
const { format } = require("date-fns"); // Import date-fns for formatting

// Function to parse appointment date and time from a message
const parseAppointmentDateTime = (message) => {
  const dateMatch = message.match(/on (\d{1,2} \w+ \d{4})/);
  const timeMatch = message.match(/at (\d{1,2}:\d{2} (?:AM|PM))/);

  if (dateMatch && timeMatch) {
    const date = dateMatch[1];
    const time = timeMatch[1];
    const dateTimeString = `${date} ${time}`; // Combine date and time
    const dateTime = new Date(dateTimeString); // Create a Date object
    return dateTime;
  }
  return null;
};

// Notify a user with a message and notification type
const notifyUser = async (userId, message, notificationType) => {
  try {
    const query = `
      INSERT INTO notifications (user_id, message, notification_type, is_read, created_at)
      VALUES ($1, $2, $3, FALSE, NOW()) RETURNING *; 
    `;
    const result = await db.query(query, [userId, message, notificationType]);
    const notification = result.rows[0];

    if (notificationType === "appointment_approved") {
      const dateTime = parseAppointmentDateTime(message);
      if (dateTime) {
        notification.eventDateTime = dateTime;
      }
    }

    return notification;
  } catch (error) {
    console.error("Error inserting notification:", error);
    throw new Error("Failed to notify user.");
  }
};

// Get Notifications for a User
const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    // Query to fetch notifications for the user
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
    await db.query(query, [notificationIds]); // Update the notifications to mark them as read
    res.status(200).json({ message: "Notifications marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};

// Count unread notifications for a specific user
const countNotification = async (req, res) => {
  const { userId } = req.params;

  try {
    // Query to count unread notifications for the user
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

module.exports = {
  notifyUser,
  getNotifications,
  markNotificationsAsRead,
  countNotification,
};
