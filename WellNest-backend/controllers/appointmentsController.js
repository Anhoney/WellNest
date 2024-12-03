// appointmentsController.js
const pool = require("../config/db");
const { format } = require("date-fns"); // Install via `npm install date-fns`

const createAppointment = async (req, res) => {
  const {
    description,
    location,
    hospitalAdds,
    availableDays,
    availableTimes,
    category,
  } = req.body;
  const userId = req.userId; // Get user ID from request
  // console.log("Appointment data received:", req.body);

  try {
    // Check if an appointment with the same category already exists for the user
    // const existingAppointment = await pool.query(
    //   "SELECT id FROM hp_availability WHERE user_id = $1 AND category = $2",
    //   [userId, category]
    // );

    // if (existingAppointment.rows.length > 0) {
    //   return res.status(400).json({
    //     error: `You have already created an appointment for the category "${category}".`,
    //   });
    // }

    // Insert the new appointment if no conflict exists
    const query = `
      INSERT INTO hp_availability (description, location, available_days, available_times, category, hospital_address, user_id)
      VALUES ($1, $2, $3, $4::text[], $5, $6, $7) RETURNING *;
    `;
    // console.log("Pool object:", pool);
    const result = await pool.query(query, [
      description,
      location,
      availableDays,
      availableTimes,
      category,
      hospitalAdds,
      userId,
    ]);
    // console.log(result.data);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Function to fetch appointments for a specific user
const getAppointments = async (req, res) => {
  const { userId } = req.params;
  // console.log("User ID:", userId);
  try {
    const result = await pool.query(
      "SELECT id, description, location, hospital_address, available_days, available_times, category, created_at FROM hp_availability WHERE user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};
// Function to delete an appointment by ID
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM hp_availability WHERE id = $1", [id]);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

// Function to update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    description,
    location,
    hospital_address,
    available_days,
    available_times,
    category,
  } = req.body;

  try {
    await pool.query(
      `UPDATE hp_availability
       SET description = $1, location = $2, available_days = $3, available_times = $4, category = $5, hospital_address = $6
       WHERE id = $7`,
      [
        description,
        location,
        available_days,
        available_times,
        category,
        hospital_address,
        id,
      ]
    );
    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// const getSingleAppointment = async (req, res) => {
//   const { appointmentId } = req.params;
//   try {
//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }
//     res.json(appointment);
//   } catch (error) {
//     console.error("Error fetching appointment:", error);
//     res.status(500).json({ message: "Error fetching appointment", error });
//   }
// };
// const getSingleAppointment = async (req, res) => {
//   const { appointmentId } = req.params;
//   try {
//     const result = await pool.query(
//       "SELECT id, description, location, available_days, available_times FROM hp_availability WHERE id = $1",
//       [appointmentId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error fetching appointment:", error);
//     res.status(500).json({ message: "Error fetching appointment", error });
//   }
// };
const getSingleAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  // console.log("Fetching appointment with ID:", appointmentId); // Log the appointment ID

  // Convert appointmentId to an integer if necessary
  const id = parseInt(appointmentId, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid appointment ID" });
  }

  try {
    const result = await pool.query(
      "SELECT  description, location, available_days, available_times, category FROM hp_availability WHERE id = $1",
      [id]
    );

    // console.log("Query result:", result.rows); // Log the result of the query

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};
const getUpcomingAppointments = async (req, res) => {
  const { hpId } = req.params;
  // console.log("Fetching upcoming appointments for hpId:", hpId);

  try {
    // const query = `
    //   SELECT
    //     hp_app_id, hp_id, u_id, health_record, app_date, app_time,
    //     app_status, app_sickness, app_description, app_address,
    //     medical_coverage, who_will_see, patient_seen_before, note,
    //     created_at, updated_at
    //   FROM public.hp_appointments
    //   WHERE hp_id = $1 AND (app_status = 'pending' OR app_status = 'upcoming')
    //     AND (app_date > CURRENT_DATE OR (app_date = CURRENT_DATE AND app_time >= CURRENT_TIME))
    //   ORDER BY app_date ASC, app_time ASC;
    // `;
    const query = `
    SELECT 
      ha.hp_app_id, ha.hp_id, ha.u_id, ha.health_record, 
      TO_CHAR(ha.app_date, 'YYYY-MM-DD') AS app_date,
      TO_CHAR(ha.app_time, 'HH12:MI AM') AS app_time,
      ha.app_status, ha.app_sickness, ha.app_description, ha.app_address, 
      ha.medical_coverage, ha.who_will_see, ha.patient_seen_before, ha.note, 
      ha.created_at, ha.updated_at , 
      CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
            ELSE NULL 
          END AS profile_image,
      u.full_name
    FROM hp_appointments ha
    JOIN profile p ON ha.u_id = p.user_id
    JOIN users u ON ha.u_id = u.id
    WHERE ha.hp_id = $1 
      AND (ha.app_date > CURRENT_DATE OR (ha.app_date = CURRENT_DATE AND ha.app_time >= CURRENT_TIME))
    ORDER BY ha.app_date ASC, ha.app_time ASC;
  `;
    const result = await pool.query(query, [hpId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No upcoming appointments found." });
    }
    // console.log("Database query result:", result.rows);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
};
const approveAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const query = `
      UPDATE hp_appointments
      SET app_status = 'approved'
      WHERE hp_app_id = $1 AND app_status = 'pending'
      RETURNING *;
    `;
    const result = await pool.query(query, [appointmentId]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Appointment not found or already approved." });
    }

    res.status(200).json({
      message: "Appointment approved successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Error approving appointment:", error);
    res.status(500).json({ error: "Failed to approve appointment" });
  }
};

// Function to get appointment details by hp_app_id
const getAppointmentDetailsByHpAppId = async (req, res) => {
  const { hp_app_id } = req.params; // Get hp_app_id from request parameters

  try {
    const query = `
      SELECT 
        ha.hp_app_id, ha.hp_id, ha.u_id, ha.health_record, 
        TO_CHAR(ha.app_date, 'YYYY-MM-DD') AS app_date,
        TO_CHAR(ha.app_time, 'HH12:MI AM') AS app_time,
        ha.app_status, ha.app_sickness, ha.app_description, 
        ha.app_address, ha.medical_coverage, ha.who_will_see, 
        ha.patient_seen_before, ha.note, ha.created_at, ha.updated_at,
        CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
            ELSE NULL 
          END AS profile_image,
          p.gender,
      u.full_name
      FROM hp_appointments ha
      JOIN profile p ON ha.u_id = p.user_id
    JOIN users u ON ha.u_id = u.id
      WHERE ha.hp_app_id = $1;
    `;

    const result = await pool.query(query, [hp_app_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Failed to fetch appointment details." });
  }
};

const deleteSingleAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const query = `
      DELETE FROM hp_appointments
      WHERE hp_app_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [appointmentId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

const getPastAppointments = async (req, res) => {
  const { hpId } = req.params;
  console.log("Fetching past appointments for hpId:", hpId);

  try {
    const query = `
      SELECT 
        ha.hp_app_id, ha.hp_id, ha.u_id, ha.health_record, 
        TO_CHAR(ha.app_date, 'YYYY-MM-DD') AS app_date,
        TO_CHAR(ha.app_time, 'HH12:MI AM') AS app_time,
        ha.app_status, ha.app_sickness, ha.app_description, 
        ha.app_address, ha.medical_coverage, ha.who_will_see, 
        ha.patient_seen_before, ha.note, ha.created_at, ha.updated_at,
        CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
            ELSE NULL 
          END AS profile_image,
          u.full_name
      FROM hp_appointments ha
      JOIN profile p ON ha.u_id = p.user_id
    JOIN users u ON ha.u_id = u.id
      WHERE ha.hp_id = $1 
      AND ha.app_date < CURRENT_DATE
      ORDER BY ha.app_date DESC, ha.app_time DESC;
    `;

    const result = await pool.query(query, [hpId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No past appointments found." });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching past appointments:", error);
    res.status(500).json({ error: "Failed to fetch past appointments" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointment,
  getSingleAppointment,
  getUpcomingAppointments,
  approveAppointment,
  getAppointmentDetailsByHpAppId,
  deleteSingleAppointment,
  getPastAppointments,
};
