// reminderScheduler.js
const schedule = require("node-schedule");
const db = require("./config/db");
const { notifyUser } = require("./controllers/notificationController");
const { checkAlarms } = require("./controllers/medicationController");
const cron = require("node-cron");

// Function to fetch upcoming medication reminders
const fetchUpcomingReminders = async () => {
  const now = new Date();
  const upcomingReminders = await db.query(
    `SELECT * FROM medications WHERE time > $1 AND status = 'Pending'`,
    [now]
  );
  return upcomingReminders.rows;
};

// Function to schedule notifications
const scheduleNotifications = async () => {
  const reminders = await fetchUpcomingReminders();

  reminders.forEach((reminder) => {
    const reminderTime = new Date(reminder.time);
    const job = schedule.scheduleJob(reminderTime, async () => {
      await notifyUser(
        reminder.u_id,
        `Time to take your medication: ${reminder.pill_name}`,
        "medication_reminder"
      );
      console.log(`Notification sent for medication: ${reminder.pill_name}`);
    });
  });
};

// Schedule the job to run every minute
schedule.scheduleJob("* * * * *", () => {
  console.log("Checking for upcoming medication reminders...");
  scheduleNotifications();
});

// Schedule the alarm check every minute
// cron.schedule("* * * * *", checkAlarms); // Runs every minute
