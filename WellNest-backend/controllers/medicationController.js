//medicationController.js
const { API_BASE_URL } = require("../config/config");
const pool = require("../config/db");
const { notifyUser, createNotification } = require("./notificationController"); // Import createNotification
const { format } = require("date-fns");
const cron = require("node-cron");

const createReminder = async (req, res) => {
  const {
    pillName,
    amount,
    duration,
    time,
    foodRelation,
    repeatOption,
    userId,
    notificationTimes,
    frequency,
  } = req.body; // Include repeatOption and userId
  console.log("Request Body:", req.body);
  let medicineImage = null;
  console.log("pill name", pillName);
  // Check if a file was uploaded
  if (req.file) {
    medicineImage = `${API_BASE_URL}/uploads/${req.file.filename}`;
    // req.file.path; // Store the file path
    console.log(
      "Uploaded file path:",
      `${API_BASE_URL}/uploads/${req.file.filename}`
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO medications (pill_name, amount, duration,time, food_relation, repeat_option, medicine_image, u_id, notification_times, frequency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        pillName,
        amount,
        duration,
        time,
        foodRelation,
        repeatOption,
        medicineImage,
        userId,
        notificationTimes,
        frequency,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving medication reminder:", error.message);
    res.status(500).json({ error: "Failed to save medication reminder." });
  }
};

const getMedications = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM medications WHERE u_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    // `SELECT id, pill_name, amount, duration, time, food_relation, repeat_option, medicine_image, created_at, u_id
    //    FROM medications WHERE u_id = $1 ORDER BY created_at DESC`,
    //   [userId]
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching medications:", error.message);
    res.status(500).json({ error: "Failed to fetch medications." });
  }
};

const updateReminder = async (req, res) => {
  const {
    pillName,
    amount,
    duration,
    foodRelation,
    repeatOption,
    userId,
    notificationTimes,
    frequency,
    // medicationId,
  } = req.body;
  const { medicationId } = req.params;
  let medicineImage = null;
  console.log("medicationId", medicationId);
  if (req.file) {
    medicineImage = `${API_BASE_URL}/uploads/${req.file.filename}`;
  }
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Files:", req.files); // If using file uploads
  try {
    const result = await pool.query(
      `UPDATE medications SET pill_name = $1, amount = $2, duration = $3,  food_relation = $4, repeat_option = $5, medicine_image = $6, notification_times = $7, frequency = $8
       WHERE id = $9 AND u_id = $10 RETURNING *`,
      [
        pillName,
        amount,
        duration,
        // time,
        foodRelation,
        repeatOption,
        medicineImage,
        notificationTimes,
        frequency,
        medicationId,
        userId,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating medication reminder:", error.message);
    res.status(500).json({ error: "Failed to update medication reminder." });
  }
};

// New function to fetch medication by ID
const getMedicationById = async (req, res) => {
  const { medicationId } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM medications WHERE id = $1`, [
      medicationId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Medication not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching medication:", error.message);
    res.status(500).json({ error: "Failed to fetch medication." });
  }
};

const deleteReminder = async (req, res) => {
  const { medicationId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM medications WHERE id = $1 RETURNING *`,
      [medicationId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Medication not found or already deleted" });
    }

    res.status(200).json({
      message: "Medication reminder deleted successfully",
      medication: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting medication reminder:", error.message);
    res.status(500).json({ error: "Failed to delete medication reminder." });
  }
};

const updateMedicationStatus = async (req, res) => {
  const { medicationId } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE medications SET status = $1 WHERE id = $2 RETURNING *`,
      [status, medicationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Medication not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating medication status:", error.message);
    res.status(500).json({ error: "Failed to update medication status." });
  }
};

const getMedicationsByStatus = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, pill_name, amount, duration, time, food_relation, repeat_option, medicine_image, created_at, u_id, status FROM public.medications WHERE status != 'Completed';"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch medications." });
  }
};

const updateMedicationStatusCompleted = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE public.medications SET status = 'Completed' WHERE id = $1;",
      [id]
    );
    res
      .status(200)
      .json({ message: "Medication status updated to Completed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update medication status." });
  }
};

// Function to check and trigger alarms
const checkAlarms = async () => {
  const currentTime = format(new Date(), "HH:mm"); // Get current time in 'HH:mm' format
  try {
    const result = await pool.query(
      `SELECT * FROM medications WHERE time = $1 AND status != 'Completed'`,
      [currentTime]
    );

    // Trigger the alarm if a match is found
    if (result.rows.length > 0) {
      result.rows.forEach(async (medication) => {
        console.log(`Alarm triggered for medication: ${medication.pill_name}`);
        await createNotification(
          medication.u_id,
          `Time to take ${medication.pill_name}`
        );

        // Update the medication status to 'In Progress' if necessary
        await pool.query(
          "UPDATE medications SET status = 'In Progress' WHERE id = $1",
          [medication.id]
        );
      });
    }
  } catch (error) {
    console.error("Error checking alarms:", error.message);
  }
};

// Schedule the job to check alarms every minute (or adjust as needed)
// cron.schedule("* * * * *", checkAlarms); // Runs every minute

// Stop Alarm
const stopAlarm = async (req, res) => {
  const { medicationId } = req.body; // Take medicationId from request body

  try {
    const result = await pool.query(
      "UPDATE medications SET status = 'Completed' WHERE id = $1 RETURNING *",
      [medicationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Medication not found" });
    }

    res.status(200).json({
      message: "Alarm stopped successfully.",
      medication: result.rows[0],
    });
  } catch (error) {
    console.error("Error stopping alarm:", error.message);
    res.status(500).json({ error: "Failed to stop alarm." });
  }
};

// Snooze Alarm
const snoozeAlarm = async (req, res) => {
  const { medicationId } = req.body; // Take medicationId from request body
  const snoozeDuration = 5; // Minutes to snooze (adjust as needed)

  try {
    // Fetch the current medication time
    const result = await pool.query(
      "SELECT time FROM medications WHERE id = $1",
      [medicationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Medication not found" });
    }

    const currentTime = result.rows[0].time;
    const newTime = format(
      new Date(new Date().setMinutes(new Date().getMinutes() + snoozeDuration)),
      "HH:mm"
    );

    // Update the medication time to the new snoozed time
    await pool.query(
      "UPDATE medications SET time = $1 WHERE id = $2 RETURNING *",
      [newTime, medicationId]
    );

    res.status(200).json({
      message: `Alarm snoozed for ${snoozeDuration} minutes.`,
    });
  } catch (error) {
    console.error("Error snoozing alarm:", error.message);
    res.status(500).json({ error: "Failed to snooze alarm." });
  }
};

module.exports = {
  createReminder,
  getMedications,
  updateReminder,
  getMedicationById,
  deleteReminder,
  updateMedicationStatus,
  getMedicationsByStatus,
  updateMedicationStatusCompleted,
  stopAlarm,
  snoozeAlarm,
  checkAlarms,
};
