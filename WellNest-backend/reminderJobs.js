//reminderJobs.js
const schedule = require("node-schedule");
const db = require("./config/db");
const { notifyUser } = require("./controllers/notificationController");
const { checkAlarms } = require("./controllers/medicationController");
const cron = require("node-cron");

// Schedule the alarm check every minute
// cron.schedule("* * * * *", checkAlarms); // Runs every minute
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
