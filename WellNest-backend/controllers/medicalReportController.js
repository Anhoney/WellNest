//medicalReportController.js
const pool = require("../config/db");
const { notifyUser, createNotification } = require("./notificationController"); // Import createNotification

//Healthcare Provider
// Fetch medical report and associated medicines
const getMedicalReport = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    // Fetch medical report
    const reportResult = await pool.query(
      `SELECT * FROM medical_reports WHERE appointment_id = $1`,
      [appointment_id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: "No medical report found." });
    }

    const report = reportResult.rows[0];

    // Fetch associated medicines
    const medicinesResult = await pool.query(
      `SELECT name, dosage, duration FROM report_medicines WHERE report_id = $1`,
      [report.report_id]
    );

    res.status(200).json({
      ...report,
      medicines: medicinesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching medical report:", error);
    res.status(500).json({ error: "Failed to fetch medical report." });
  }
};

const createOrUpdateMedicalReport = async (req, res) => {
  const {
    appointment_id,
    appointment_type, // New field to differentiate between physical and virtual
    encounter_summary,
    follow_up_date,
    advice_given,
    medicines,
  } = req.body;

  if (!["physical", "virtual"].includes(appointment_type)) {
    return res.status(400).json({ error: "Invalid appointment type." });
  }

  try {
    // Check if the report already exists
    const existingReport = await pool.query(
      `SELECT report_id FROM medical_reports WHERE appointment_id = $1 AND appointment_type = $2`,
      [appointment_id, appointment_type]
    );

    let reportId;

    if (existingReport.rows.length > 0) {
      // Update existing report
      reportId = existingReport.rows[0].report_id;
      await pool.query(
        `UPDATE medical_reports
             SET encounter_summary = $1, follow_up_date = $2, advice_given = $3
             WHERE report_id = $4`,
        [encounter_summary, follow_up_date, advice_given, reportId]
      );

      // Fetch existing medicines
      const existingMedicines = await pool.query(
        `SELECT medicine_id, name, dosage, duration FROM report_medicines WHERE report_id = $1`,
        [reportId]
      );

      // Create a map of existing medicines by name
      const existingMedicinesMap = {};
      existingMedicines.rows.forEach((medicine) => {
        existingMedicinesMap[medicine.name] = medicine.medicine_id;
      });

      // Update or insert medicines
      for (const medicine of medicines) {
        if (medicine.name && medicine.name.trim()) {
          if (existingMedicinesMap[medicine.name]) {
            // Update existing medicine
            await pool.query(
              `UPDATE report_medicines
                   SET dosage = $1, duration = $2
                   WHERE medicine_id = $3`,
              [
                medicine.dosage,
                medicine.duration,
                existingMedicinesMap[medicine.name],
              ]
            );
          } else {
            // Insert new medicine
            await pool.query(
              `INSERT INTO report_medicines (report_id, name, dosage, duration)
                   VALUES ($1, $2, $3, $4)`,
              [reportId, medicine.name, medicine.dosage, medicine.duration]
            );
          }
        }
      }
    } else {
      // Insert new report
      const reportResult = await pool.query(
        `INSERT INTO medical_reports (appointment_id, appointment_type, encounter_summary, follow_up_date, advice_given)
             VALUES ($1, $2, $3, $4, $5) RETURNING report_id`,
        [
          appointment_id,
          appointment_type,
          encounter_summary,
          follow_up_date,
          advice_given,
        ]
      );
      reportId = reportResult.rows[0].report_id;

      // Insert new medicines
      for (const medicine of medicines) {
        if (medicine.name && medicine.name.trim()) {
          await pool.query(
            `INSERT INTO report_medicines (report_id, name, dosage, duration)
                 VALUES ($1, $2, $3, $4)`,
            [reportId, medicine.name, medicine.dosage, medicine.duration]
          );
        }
      }
    }

    // Fetch user ID based on appointment type
    let userId;
    if (appointment_type === "virtual") {
      const userResult = await pool.query(
        `SELECT u_id FROM hp_virtual_appointment WHERE hpva_id = $1`,
        [appointment_id]
      );
      userId = userResult.rows[0]?.u_id;
    } else if (appointment_type === "physical") {
      const userResult = await pool.query(
        `SELECT u_id FROM hp_appointments WHERE app_id = $1`,
        [appointment_id]
      );
      userId = userResult.rows[0]?.u_id;
    }

    if (!userId) {
      return res
        .status(404)
        .json({ message: "User  not found for this appointment." });
    }

    // Notify the user about the report creation or update
    const action = existingReport.rows.length > 0 ? "updated" : "created";
    const message = `Your medical report has been ${action} for appointment ID ${appointment_id}.`;
    await notifyUser(userId, message, "medical_report_notification");
    // await createNotification(userId, message);

    // Notify the user about the report creation or update
    // const action = existingReport.rows.length > 0 ? "updated" : "created";
    // const message = `Your medical report has been ${action} for appointment ID ${appointment_id}.`;
    // await createNotification(appointment_id, message); // Assuming appointment_id corresponds to user ID for notification

    res.status(200).json({ message: "Medical report saved successfully." });
  } catch (error) {
    console.error("Error saving medical report:", error);
    res.status(500).json({ error: "Failed to save medical report." });
  }
};

// In your medical report controller file
const deleteMedicalReport = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    // Delete associated medicines first
    await pool.query(
      `DELETE FROM report_medicines WHERE report_id IN (
          SELECT report_id FROM medical_reports WHERE appointment_id = $1
        )`,
      [appointment_id]
    );

    // Now delete the medical report
    const result = await pool.query(
      `DELETE FROM medical_reports WHERE appointment_id = $1`,
      [appointment_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No medical report found." });
    }
    // Fetch user ID based on appointment type
    let userId;
    const appointmentTypeResult = await pool.query(
      `SELECT appointment_type FROM medical_reports WHERE appointment_id = $1`,
      [appointment_id]
    );

    const appointmentType = appointmentTypeResult.rows[0]?.appointment_type;

    if (appointmentType === "virtual") {
      const userResult = await pool.query(
        `SELECT u_id FROM hp_virtual_appointment WHERE hpva_id = $1`,
        [appointment_id]
      );
      userId = userResult.rows[0]?.u_id;
    } else if (appointmentType === "physical") {
      const userResult = await pool.query(
        `SELECT u_id FROM hp_appointments WHERE app_id = $1`,
        [appointment_id]
      );
      userId = userResult.rows[0]?.u_id;
    }
    if (!userId) {
      return res
        .status(404)
        .json({ message: "User  not found for this appointment." });
    }

    // Notify the user about the report deletion
    const message = `Your medical report for appointment ID ${appointment_id} has been deleted.`;
    await notifyUser(userId, message, "medical_report_notification");
    // await createNotification(userId, message);

    // Notify the user about the report deletion
    // const message = `Your medical report for appointment ID ${appointment_id} has been deleted.`;
    // await createNotification(appointment_id, message); // Assuming appointment_id corresponds to user ID for notification

    res.status(200).json({ message: "Medical report deleted successfully." });
  } catch (error) {
    console.error("Error deleting medical report:", error);
    res.status(500).json({ error: "Failed to delete medical report." });
  }
};

const checkMedicalReportExists = async (req, res) => {
  const { hpva_id, appointment_type } = req.params;

  try {
    const result = await pool.query(
      `SELECT 1 FROM medical_reports WHERE appointment_id = $1 AND appointment_type = $2`,
      [hpva_id, appointment_type]
    );

    // Respond with whether the report exists
    res.status(200).json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error("Error checking medical report existence:", error);
    res
      .status(500)
      .json({ error: "Failed to check medical report existence." });
  }
};

//Elderly
const getUserMedicalReports = async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT 
        mr.report_id,
        mr.appointment_id,
        mr.encounter_summary,
        mr.follow_up_date,
        mr.advice_given,
        mr.created_at,
        mr.appointment_type,
        rm.medicine_id,
        rm.name AS medicine_name,
        rm.dosage,
        rm.duration
      FROM public.medical_reports mr
      LEFT JOIN public.report_medicines rm ON mr.report_id = rm.report_id
      LEFT JOIN public.hp_appointments ha ON ha.hp_app_id = mr.appointment_id
      LEFT JOIN public.hp_virtual_appointment hva ON hva.hpva_id = mr.appointment_id
      WHERE ha.u_id = $1 OR hva.u_id = $1
      ORDER BY mr.created_at DESC;
    `;

    const results = await pool.query(query, [userId]);

    res.json(results.rows);
  } catch (error) {
    console.error("Error fetching medical reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getMedicalReport,
  createOrUpdateMedicalReport,
  deleteMedicalReport,
  checkMedicalReportExists,
  getUserMedicalReports,
};
