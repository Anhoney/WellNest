//notificationController.js
const db = require("../config/db");
const { format } = require("date-fns"); // Import date-fns for formatting
// const io = require("../server"); // Import the io instance
// Notify User
const notifyUser = async (userId, message, notificationType) => {
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
    // const result = await db.query(query, [userId, message, notificationType]);
    // const notification = result.rows[0];

    // // Emit the notification to the specific user
    // io.to(userId).emit("new_notification", notification);

    console.log("Notification inserted and emitted successfully.");
  } catch (error) {
    console.error("Error inserting notification:", error);
    throw new Error("Failed to notify user.");
  }
};

// Trigger Notifications Based on Events
// const triggerNotification = async (req, res) => {
//   const { userId, actionType } = req.body;
//   console.log("triggerNotification userId:", userId);
//   let message = "";
//   switch (actionType) {
//     case "medical_report_updated":
//       message = "Your medical report has been updated.";
//       break;
//     case "appointment_approved":
//       message = "Your appointment has been approved.";
//       break;
//     case "appointment_deleted":
//       message = "Your appointment has been canceled.";
//       break;
//     case "new_appointment_request":
//       message = "You have a new appointment request.";
//       break;
//     case "appointment_canceled":
//       message = "The appointment has been canceled by the user.";
//       break;
//     default:
//       message = "You have a new notification.";
//   }

//   try {
//     await notifyUser(userId, message, actionType);
//     res.status(200).json({ message: "Notification triggered successfully." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to trigger notification." });
//   }
// };

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

// const checkUpcomingAppointments = async () => {
//   const currentDate = new Date();
//   const tomorrow = new Date();
//   tomorrow.setDate(currentDate.getDate() + 1);
//   tomorrow.setHours(0, 0, 0, 0); // Set to start of tomorrow

//   const oneHourFromNow = new Date();
//   oneHourFromNow.setHours(currentDate.getHours() + 1);

//   try {
//     // Fetch virtual appointments
//     const virtualAppointments = await db.query(`
//         SELECT hpva_id, u_id, hpva_date, hpva_time
//         FROM public.hp_virtual_appointment
//       `);

//     // Fetch regular appointments
//     const regularAppointments = await db.query(`
//         SELECT hp_app_id, u_id, app_date, app_time
//         FROM public.hp_appointments
//       `);

//     // Check virtual appointments for tomorrow
//     for (const appointment of virtualAppointments.rows) {
//       const appointmentDate = new Date(appointment.hpva_date);
//       const appointmentTime = new Date(
//         `${appointment.hpva_date}T${appointment.hpva_time}`
//       );

//       // Check if the appointment is tomorrow
//       if (
//         appointmentDate >= tomorrow &&
//         appointmentDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
//       ) {
//         // Create notification for tomorrow's appointment
//         await createNotification(
//           appointment.u_id,
//           `You have a virtual appointment at ${formattedTime} on ${formattedDate}.`
//         );
//       }

//       // Check if the appointment is within the next hour
//       if (appointmentTime <= oneHourFromNow) {
//         // Format the date and time for the notification
//         const formattedTime = format(appointmentTime, "h:mm a"); // e.g., "10:00 AM"
//         const formattedDate = format(appointmentDate, "dd MMM yyyy"); // e.g., "16 Dec 2024"

//         // Create notification for the appointment in one hour
//         await createNotification(
//           appointment.u_id,
//           `You have a virtual appointment in less than an hour at ${formattedTime} on ${formattedDate}.`
//         );
//       }
//     }

//     // Check regular appointments for tomorrow
//     for (const appointment of regularAppointments.rows) {
//       const appointmentDate = new Date(appointment.app_date);
//       const appointmentTime = new Date(
//         `${appointment.app_date}T${appointment.app_time}`
//       );

//       // Check if the appointment is tomorrow
//       if (
//         appointmentDate >= tomorrow &&
//         appointmentDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
//       ) {
//         // Format the date and time for the notification
//         const formattedTime = format(appointmentTime, "h:mm a"); // e.g., "10:00 AM"
//         const formattedDate = format(appointmentDate, "dd MMM yyyy"); // e.g., "16 Dec 2024"

//         // Create notification for tomorrow's appointment
//         await createNotification(
//           appointment.u_id,
//           `You have a regular appointment at ${formattedTime} on ${formattedDate}.`
//         );
//       }

//       // Check if the appointment is within the next hour
//       if (appointmentTime <= oneHourFromNow) {
//         // Format the date and time for the notification
//         const formattedTime = format(appointmentTime, "h:mm a"); // e.g., "10:00 AM"
//         const formattedDate = format(appointmentDate, "dd MMM yyyy"); // e.g., "16 Dec 2024"

//         // Create notification for the appointment in one hour
//         await createNotification(
//           appointment.u_id,
//           `You have a regular appointment in less than an hour at ${formattedTime} on ${formattedDate}.`
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error checking upcoming appointments:", error);
//   }
// };

// // Function to create a notification
// const createNotification = async (userId, message) => {
//   const query = `
//       INSERT INTO public.notifications (user_id, message, is_read, created_at, notification_type)
//       VALUES ($1, $2, FALSE, NOW(), 'appointment_reminder')
//     `;
//   await db.query(query, [userId, message]);
// };
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
