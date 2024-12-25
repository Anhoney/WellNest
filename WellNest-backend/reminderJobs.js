//reminderJobs.js
// const schedule = require("node-schedule");
// const db = require("./config/db");
// const { notifyUser } = require("./controllers/notificationController"); // Import notifyUser function

// // Reminder 1 hour before
// schedule.scheduleJob("0 * * * *", async () => {
//   try {
//     const query = `
//             SELECT *
//             FROM appointments
//             WHERE app_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
//         `;
//     const { rows: appointments } = await db.query(query);

//     for (const appointment of appointments) {
//       await notifyUser(
//         appointment.user_id,
//         "You have an appointment in 1 hour.",
//         "reminder"
//       );
//     }
//   } catch (error) {
//     console.error("Error scheduling reminders:", error);
//   }
// });

// module.exports = schedule;

// const schedule = require("node-schedule");
// const db = require("./config/db");
// const { notifyUser } = require("./controllers/notificationController"); // Import notifyUser  function

// // Reminder 1 hour before for both virtual and regular appointments
// schedule.scheduleJob("0 * * * *", async () => {
//   try {
//     const virtualQuery = `
//             SELECT *
//             FROM hp_virtual_appointment
//             WHERE hpva_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
//         `;
//     const regularQuery = `
//             SELECT *
//             FROM hp_appointments
//             WHERE app_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
//         `;

//     const { rows: virtualAppointments } = await db.query(virtualQuery);
//     const { rows: regularAppointments } = await db.query(regularQuery);

//     // Notify for virtual appointments
//     for (const appointment of virtualAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a virtual appointment in 1 hour.",
//         "reminder"
//       );
//     }

//     // Notify for regular appointments
//     for (const appointment of regularAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a regular appointment in 1 hour.",
//         "reminder"
//       );
//     }
//   } catch (error) {
//     console.error("Error scheduling reminders:", error);
//   }
// });

// // Reminder 1 day before for both virtual and regular appointments
// schedule.scheduleJob("0 0 * * *", async () => {
//   try {
//     const virtualQuery = `
//             SELECT *
//             FROM hp_virtual_appointment
//             WHERE hpva_time BETWEEN NOW() AND NOW() + INTERVAL '1 day'
//         `;
//     const regularQuery = `
//             SELECT *
//             FROM hp_appointments
//             WHERE app_date BETWEEN NOW() AND NOW() + INTERVAL '1 day'
//         `;

//     const { rows: virtualAppointments } = await db.query(virtualQuery);
//     const { rows: regularAppointments } = await db.query(regularQuery);

//     // Notify for virtual appointments
//     for (const appointment of virtualAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a virtual appointment tomorrow.",
//         "reminder"
//       );
//     }

//     // Notify for regular appointments
//     for (const appointment of regularAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a regular appointment tomorrow.",
//         "reminder"
//       );
//     }
//   } catch (error) {
//     console.error("Error scheduling reminders:", error);
//   }
// });

// // Check for appointment status changes for both virtual and regular appointments
// const checkAppointmentChanges = async () => {
//   const virtualQuery = `
//           SELECT * FROM hp_virtual_appointment
//           WHERE updated_at > NOW() - INTERVAL '1 hour'
//       `;
//   const regularQuery = `
//           SELECT * FROM hp_appointments
//           WHERE updated_at > NOW() - INTERVAL '1 hour'
//       `;
//   //   const virtualQuery = `
//   //   SELECT * FROM hp_virtual_appointment
//   //   WHERE updated_at > NOW() - INTERVAL '1 hour' AND status = 'approved'
//   // `;
//   //   const regularQuery = `
//   //   SELECT * FROM hp_appointments
//   //   WHERE updated_at > NOW() - INTERVAL '1 hour' AND app_status = 'approved'
//   // `;

//   try {
//     const { rows: updatedVirtualAppointments } = await db.query(virtualQuery);
//     const { rows: updatedRegularAppointments } = await db.query(regularQuery);

//     // Check for status changes in virtual appointments
//     for (const appointment of updatedVirtualAppointments) {
//       if (appointment.status === "approved") {
//         await notifyUser(
//           appointment.u_id,
//           "Your virtual appointment has been approved.",
//           "appointment_approved"
//         );
//       }
//       // Add more conditions as needed for other status changes
//     }

//     // Check for status changes in regular appointments
//     for (const appointment of updatedRegularAppointments) {
//       if (appointment.app_status === "approved") {
//         await notifyUser(
//           appointment.u_id,
//           "Your regular appointment has been approved.",
//           "appointment_approved"
//         );
//       }
//       // Add more conditions as needed for other status changes
//     }
//   } catch (error) {
//     console.error("Error checking appointment changes:", error);
//   }
// };

// // Schedule the check for appointment changes every hour
// schedule.scheduleJob("0 * * * *", checkAppointmentChanges);

// module.exports = schedule;

//reminderJobs.js
const schedule = require("node-schedule");
const db = require("./config/db");
const { notifyUser } = require("./controllers/notificationController");

// Helper function to format the date
const formatDate = (date) => {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

// Helper function to format the time
const formatTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")}${period}`;
};

// Helper function to check if a notification already exists
const notificationExists = async (user_id, message) => {
  const query = `SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1 AND message = $2`;
  const values = [user_id, message];
  try {
    const { rows } = await db.query(query, values);
    return rows[0].count > 0;
  } catch (error) {
    console.error("Error checking notification existence:", error);
    return false;
  }
};

// Helper function to fetch appointments
const fetchAppointments = async (query) => {
  try {
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// Helper function to send reminders
const sendReminders = async (appointments, messageTemplate) => {
  for (const appointment of appointments) {
    const message = messageTemplate(appointment);
    const exists = await notificationExists(appointment.u_id, message);
    if (!exists) {
      await notifyUser(appointment.u_id, message, "appointment_reminder");
    }
  }
};

// Define scheduled reminders
schedule.scheduleJob("* * * * *", async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Format times for precise matching
    const currentDate = now.toISOString().split("T")[0];
    const oneHourTime = oneHourFromNow.toTimeString().split(" ")[0];
    const oneDayDate = oneDayFromNow.toISOString().split("T")[0];

    // Queries for exact matches
    const virtualHourQuery = `
      SELECT u_id, hpva_date, hpva_time
      FROM hp_virtual_appointment
      WHERE hpva_date = '${currentDate}' AND hpva_time = '${oneHourTime}' AND status = 'approved' ;
    `;

    const regularHourQuery = `
      SELECT u_id, app_date, app_time
      FROM hp_appointments
      WHERE app_date = '${currentDate}' AND app_time = '${oneHourTime}' AND app_status = 'approved';
    `;

    const virtualDayQuery = `
      SELECT u_id, hpva_date, hpva_time
      FROM hp_virtual_appointment
      WHERE hpva_date = '${oneDayDate}' AND hpva_time = '${oneHourTime}' AND status = 'approved';
    `;

    const regularDayQuery = `
      SELECT u_id, app_date, app_time
      FROM hp_appointments
      WHERE app_date = '${oneDayDate}' AND app_time = '${oneHourTime}' AND app_status = 'approved';
    `;

    // Fetch appointments
    const [virtualHourAppointments, regularHourAppointments] =
      await Promise.all([
        fetchAppointments(virtualHourQuery),
        fetchAppointments(regularHourQuery),
      ]);
    const [virtualDayAppointments, regularDayAppointments] = await Promise.all([
      fetchAppointments(virtualDayQuery),
      fetchAppointments(regularDayQuery),
    ]);

    // Send reminders
    await sendReminders(
      virtualHourAppointments,
      (appt) =>
        `You have a virtual consultation appointment on ${formatDate(
          appt.hpva_date
        )} in 1 hour at ${formatTime(appt.hpva_time)}.`
    );
    await sendReminders(
      regularHourAppointments,
      (appt) =>
        `You have a physical appointment on ${formatDate(
          appt.app_date
        )} in 1 hour at ${formatTime(appt.app_time)}.`
    );
    await sendReminders(
      virtualDayAppointments,
      (appt) =>
        `You have a virtual consultation appointment tomorrow on ${formatDate(
          appt.hpva_date
        )} at ${formatTime(appt.hpva_time)}.`
    );
    await sendReminders(
      regularDayAppointments,
      (appt) =>
        `You have a physical appointment tomorrow on ${formatDate(
          appt.app_date
        )} at ${formatTime(appt.app_time)}.`
    );
  } catch (error) {
    console.error("Error scheduling reminders:", error);
  }
});

// const schedule = require("node-schedule");
// const db = require("./config/db");
// const { notifyUser } = require("./controllers/notificationController");

// // Helper function to format the date
// const formatDate = (date) => {
//   const options = {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     weekday: "short",
//   };
//   return new Intl.DateTimeFormat("en-US", options).format(date);
// };

// // Helper function to format the time
// const formatTime = (time) => {
//   const [hours, minutes] = time.split(":").map(Number);
//   const period = hours >= 12 ? "PM" : "AM";
//   const formattedHours = hours % 12 || 12;
//   return `${formattedHours}:${minutes.toString().padStart(2, "0")}${period}`;
// };

// // Helper function to check if a notification already exists
// const notificationExists = async (u_id, message) => {
//   const query = `SELECT COUNT(*) AS count FROM notifications WHERE u_id = $1 AND message = $2`;
//   const values = [u_id, message];
//   try {
//     const { rows } = await db.query(query, values);
//     return rows[0].count > 0;
//   } catch (error) {
//     console.error("Error checking notification existence:", error);
//     return false;
//   }
// };

// // Helper function to fetch appointments
// const fetchAppointments = async (query) => {
//   try {
//     const { rows } = await db.query(query);
//     return rows;
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return [];
//   }
// };

// // // Helper function to send reminders
// // const sendReminders = async (appointments, messageTemplate) => {
// //   for (const appointment of appointments) {
// //     const message = messageTemplate(appointment);
// //     await notifyUser(appointment.u_id, message, "appointment_reminder");
// //   }
// // };

// // Helper function to send reminders
// const sendReminders = async (appointments, messageTemplate) => {
//   for (const appointment of appointments) {
//     const message = messageTemplate(appointment);
//     const exists = await notificationExists(appointment.u_id, message);
//     if (!exists) {
//       await notifyUser(appointment.u_id, message, "appointment_reminder");
//     }
//   }
// };

// // Define scheduled reminders
// schedule.scheduleJob("*/15 * * * *", async () => {
//   //*/15 * * * * execute in every hour
//   try {
//     // const currentDateTime = new Date();
//     // const oneHourFromNow = new Date(currentDateTime.getTime() + 60 * 60 * 1000);
//     // const tomorrow = new Date(currentDateTime.getTime() + 24 * 60 * 60 * 1000);
//     const now = new Date();
//     const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

//     // Queries for appointments
//     const virtualHourQuery = `
//     SELECT u_id, hpva_date, hpva_time
//     FROM hp_virtual_appointment
//     WHERE (hpva_date + hpva_time) BETWEEN NOW() AND NOW() + INTERVAL '1 hour';
//   `;

//     const regularHourQuery = `
//     SELECT u_id, app_date, app_time
//     FROM hp_appointments
//     WHERE (app_date + app_time) BETWEEN NOW() AND NOW() + INTERVAL '1 hour';
//   `;

//     const virtualDayQuery = `
//     SELECT u_id, hpva_date, hpva_time
//     FROM hp_virtual_appointment
//     WHERE hpva_date = CURRENT_DATE + INTERVAL '1 day';
//   `;

//     const regularDayQuery = `
//     SELECT u_id, app_date, app_time
//     FROM hp_appointments
//     WHERE app_date = CURRENT_DATE + INTERVAL '1 day';
//   `;

//     // Fetch appointments
//     const [virtualHourAppointments, regularHourAppointments] =
//       await Promise.all([
//         fetchAppointments(virtualHourQuery),
//         fetchAppointments(regularHourQuery),
//       ]);
//     const [virtualDayAppointments, regularDayAppointments] = await Promise.all([
//       fetchAppointments(virtualDayQuery),
//       fetchAppointments(regularDayQuery),
//     ]);

//     // Send reminders
//     await sendReminders(
//       virtualHourAppointments,
//       (appt) =>
//         `You have a virtual consultation appointment on ${formatDate(
//           appt.hpva_date
//         )} in 1 hour at ${formatTime(appt.hpva_time)}.`
//     );
//     await sendReminders(
//       regularHourAppointments,
//       (appt) =>
//         `You have a physical appointment on ${formatDate(
//           appt.app_date
//         )} in 1 hour at ${formatTime(appt.app_time)}.`
//     );
//     await sendReminders(
//       virtualDayAppointments,
//       (appt) =>
//         `You have a virtual consultation appointment tomorrow on ${formatDate(
//           appt.hpva_date
//         )} at ${formatTime(appt.hpva_time)}.`
//     );
//     await sendReminders(
//       regularDayAppointments,
//       (appt) =>
//         `You have a physical appointment tomorrow on ${formatDate(
//           appt.app_date
//         )} at ${formatTime(appt.app_time)}.`
//     );
//   } catch (error) {
//     console.error("Error scheduling reminders:", error);
//   }
// });

// const schedule = require("node-schedule");
// const db = require("./config/db");
// const { notifyUser } = require("./controllers/notificationController"); // Import notifyUser  function

// // Helper function to fetch appointments
// const fetchAppointments = async (query) => {
//   try {
//     const { rows } = await db.query(query);
//     return rows;
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return [];
//   }
// };

// // Helper function to send reminders
// const sendReminders = async (appointments, messageTemplate) => {
//   for (const appointment of appointments) {
//     const message = messageTemplate(appointment);
//     await notifyUser(appointment.u_id, message, "appointment_reminder");
//   }
// };

// // Reminder 1 hour before for both virtual and regular appointments
// schedule.scheduleJob("0 * * * *", async () => {
//   try {
//     const currentDateTime = new Date();
//     const oneHourFromNow = new Date(currentDateTime.getTime() + 60 * 60 * 1000);
//     const tomorrow = new Date(currentDateTime.getTime() + 24 * 60 * 60 * 1000);

//     // Fetch virtual appointments
//     const virtualQuery = `
//       SELECT *
//       FROM hp_virtual_appointment
//       WHERE hpva_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
//     `;
//     const regularQuery = `
//       SELECT *
//       FROM hp_appointments
//       WHERE app_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
//     `;

//     const { rows: virtualAppointments } = await db.query(virtualQuery);
//     const { rows: regularAppointments } = await db.query(regularQuery);

//     // Notify for virtual appointments
//     for (const appointment of virtualAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a virtual appointment in 1 hour.",
//         "reminder"
//       );
//     }

//     // Notify for regular appointments
//     for (const appointment of regularAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a regular appointment in 1 hour.",
//         "reminder"
//       );
//     }

//     // Reminder for appointments tomorrow
//     const tomorrowVirtualQuery = `
//       SELECT *
//       FROM hp_virtual_appointment
//       WHERE hpva_date = CURRENT_DATE + INTERVAL '1 day'
//     `;
//     const tomorrowRegularQuery = `
//       SELECT *
//       FROM hp_appointments
//       WHERE app_date = CURRENT_DATE + INTERVAL '1 day'
//     `;

//     const { rows: tomorrowVirtualAppointments } = await db.query(
//       tomorrowVirtualQuery
//     );
//     const { rows: tomorrowRegularAppointments } = await db.query(
//       tomorrowRegularQuery
//     );

//     // Notify for tomorrow's virtual appointments
//     for (const appointment of tomorrowVirtualAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a virtual appointment tomorrow.",
//         "reminder"
//       );
//     }

//     // Notify for tomorrow's regular appointments
//     for (const appointment of tomorrowRegularAppointments) {
//       await notifyUser(
//         appointment.u_id,
//         "You have a regular appointment tomorrow.",
//         "reminder"
//       );
//     }
//   } catch (error) {
//     console.error("Error scheduling reminders:", error);
//   }
// });

// module.exports = schedule;
