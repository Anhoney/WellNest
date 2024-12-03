const pool = require("../config/db");

// const createMedicalReport = async (req, res) => {
//   //   const { hp_app_id } = req.params; // Get hp_app_id from request parameters
//   const {
//     appointment_id,
//     encounter_summary,
//     follow_up_date,
//     advice_given,
//     medicines,
//   } = req.body; // Extract from request body
//   try {
//     // Insert the medical report
//     const reportResult = await pool.query(
//       `INSERT INTO medical_reports (appointment_id, encounter_summary, follow_up_date, advice_given)
//              VALUES ($1, $2, $3, $4) RETURNING report_id`,
//       [appointment_id, encounter_summary, follow_up_date, advice_given]
//     );

//     const reportId = reportResult.rows[0].report_id;

//     // Insert medicines
//     if (medicines && medicines.length > 0) {
//       const medicineQueries = medicines.map((medicine) => {
//         return pool.query(
//           `INSERT INTO report_medicines (report_id, name, dosage, duration)
//                      VALUES ($1, $2, $3, $4)`,
//           [reportId, medicine.name, medicine.dosage, medicine.duration]
//         );
//       });
//       await Promise.all(medicineQueries);
//     }

//     res.status(201).json({ message: "Medical report created successfully." });
//   } catch (error) {
//     console.error("Error creating medical report:", error);
//     res.status(500).json({ error: "Failed to create medical report" });
//   }
// };

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

// Create or update medical report
const createOrUpdateMedicalReport = async (req, res) => {
  const {
    appointment_id,
    encounter_summary,
    follow_up_date,
    advice_given,
    medicines,
  } = req.body;

  try {
    // Check if the report already exists
    const existingReport = await pool.query(
      `SELECT report_id FROM medical_reports WHERE appointment_id = $1`,
      [appointment_id]
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
        `INSERT INTO medical_reports (appointment_id, encounter_summary, follow_up_date, advice_given)
             VALUES ($1, $2, $3, $4) RETURNING report_id`,
        [appointment_id, encounter_summary, follow_up_date, advice_given]
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

    res.status(200).json({ message: "Medical report deleted successfully." });
  } catch (error) {
    console.error("Error deleting medical report:", error);
    res.status(500).json({ error: "Failed to delete medical report." });
  }
};

module.exports = {
  getMedicalReport,
  createOrUpdateMedicalReport,
  deleteMedicalReport,
};
