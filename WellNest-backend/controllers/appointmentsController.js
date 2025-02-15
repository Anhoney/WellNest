// appointmentsController.js
const pool = require("../config/db");
const { format } = require("date-fns"); // Install via `npm install date-fns`
const { notifyUser } = require("../controllers/notificationController");

// Function to format time from 24-hour to 12-hour format
const formatTime = (timeString) => {
  const timeParts = timeString.split(":");
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd MMM yyyy"); // e.g., "16 Dec 2024"
};

// Function to create a new appointment
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

  try {
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

// Function to fetch a single appointment by its ID
const getSingleAppointment = async (req, res) => {
  const { appointmentId } = req.params;

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

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

// Function to fetch upcoming appointments for a specific healthcare provider
const getUpcomingAppointments = async (req, res) => {
  const { hpId } = req.params;

  try {
    const query = `
    SELECT 
      ha.hp_app_id, ha.hp_id, ha.u_id, 
      TO_CHAR(ha.app_date, 'YYYY-MM-DD') AS app_date,
      TO_CHAR(ha.app_time, 'HH12:MI AM') AS app_time,
      ha.app_status, ha.app_sickness, 
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

    res.status(200).json(result.rows || []);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
};

// Function to approve an appointment by the healthcare provider
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

    const appointment = result.rows[0];

    // Format the appointment date and time
    const formattedTime = formatTime(appointment.app_time); // e.g., "1:00 PM"
    const formattedDate = formatDate(appointment.app_date); // e.g., "16 Dec 2024"

    // Notify the user directly
    await notifyUser(
      appointment.u_id, // Pass user ID from query result
      `Your physical appointment at ${formattedTime} on ${formattedDate} has been approved.`,
      "appointment_approved"
    );

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
        ha.hp_app_id, ha.hp_id, ha.u_id, 
        TO_CHAR(ha.app_date, 'YYYY-MM-DD') AS app_date,
        TO_CHAR(ha.app_time, 'HH12:MI AM') AS app_time,
        ha.app_status, ha.app_sickness, ha.medical_coverage, ha.who_will_see, 
        ha.patient_seen_before, ha.note, ha.created_at, ha.updated_at,
        CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
            ELSE NULL 
          END AS profile_image,
          p.gender,
      u.full_name,
      u.phone_no
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

// Function to delete an appointment by hp_app_id
const deleteSingleAppointment = async (req, res) => {
  const { hp_app_id } = req.params;
  console.log("Deleting appointment with ID:", hp_app_id);
  try {
    const query = `
      DELETE FROM hp_appointments
      WHERE hp_app_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [hp_app_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

// Function to fetch past appointments for a specific healthcare provider
const getPastAppointments = async (req, res) => {
  const { hpId } = req.params;

  try {
    const query = `
      SELECT 
        ha.hp_app_id, ha.hp_id, ha.u_id,
        TO_CHAR(ha.app_date, 'YYYY-MM-DD') AS app_date,
        TO_CHAR(ha.app_time, 'HH12:MI AM') AS app_time,
        ha.app_status, ha.app_sickness, ha.medical_coverage, ha.who_will_see, 
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

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching past appointments:", error);
    res.status(500).json({ error: "Failed to fetch past appointments" });
  }
};

// Function to update or insert virtual consultation details
const upsertVirtualConsultation = async (req, res) => {
  const {
    description,
    servicesProvide,
    category,
    availableDays,
    availableTimes,
    bank_receiver_name,
    bank_name,
    account_number,
    hpId, // Passed from frontend
  } = req.body;

  try {
    // Check if a record with the given hpId already exists
    const { rowCount, rows } = await pool.query(
      `
      SELECT id FROM hp_virtual_availability WHERE hp_id = $1
      `,
      [hpId]
    );

    if (rowCount > 0) {
      // Record exists, perform an update
      const appointmentId = rows[0].id; // Get the existing record ID
      const { rows: updatedRows } = await pool.query(
        `
        UPDATE hp_virtual_availability
        SET description = $1, services_provide = $2, category = $3, available_days = $4, available_times = $5, bank_receiver_name = $6, bank_name = $7, account_number = $8, updated_at = NOW()
        WHERE id = $9 RETURNING *
        `,
        [
          description,
          JSON.stringify(servicesProvide), // Store as JSON
          category,
          availableDays,
          availableTimes,
          bank_receiver_name,
          bank_name,
          account_number,
          appointmentId,
        ]
      );
      res.status(200).json({
        message: "Virtual consultation updated successfully",
        data: updatedRows[0],
      });
    } else {
      // Record does not exist, perform an insert
      const { rows: insertedRows } = await pool.query(
        `
        INSERT INTO hp_virtual_availability (description, services_provide, category, available_days, available_times, bank_receiver_name, bank_name, account_number, hp_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *
        `,
        [
          description,
          JSON.stringify(servicesProvide), // Store as JSON
          category,
          availableDays,
          availableTimes,
          bank_receiver_name,
          bank_name,
          account_number,
          hpId,
        ]
      );
      res.status(200).json({
        message: "Virtual consultation created successfully",
        data: insertedRows[0],
      });
    }
  } catch (error) {
    console.error("Error upserting virtual consultation:", error);
    res.status(500).json({ error: "Failed to upsert virtual consultation" });
  }
};

// Function to fetch virtual availability details created by the healthcare provider
const getVirtualAvailabilityDetails = async (req, res) => {
  const { hpId } = req.params;
  try {
    const query = `
    SELECT 
        id, 
        description, 
        services_provide, 
        category, 
        available_days, 
        available_times, 
        bank_receiver_name, 
        bank_name, 
        account_number, 
        created_at, 
        updated_at, 
        hp_id
      FROM 
        hp_virtual_availability
      WHERE 
        hp_id = $1;
  `;
    const { rows } = await pool.query(query, [hpId]); // Pass hpId as a parameter
    res.status(200).json(rows); // Send results as JSON
  } catch (error) {
    console.error("Error fetching virtual availability details:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch virtual availability details." });
  }
};

// Function to delete a virtual appointment by ID
const deleteVirtualConsultation = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM hp_virtual_availability WHERE id = $1", [id]);
    res.json({
      message: "Virtual consultation appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting virtual consultation appointment:", error);
    res
      .status(500)
      .json({ error: "Failed to delete virtual consultation appointment" });
  }
};

// Function to update virtual appointment details
const getUpcomingVirtualAppointments = async (req, res) => {
  const { hpId } = req.params;

  try {
    const query = `
    SELECT 
      hv.hpva_id, hv.hp_id, hv.u_id, 
      TO_CHAR(hv.hpva_date, 'YYYY-MM-DD') AS hpva_date,
      TO_CHAR(hv.hpva_time, 'HH12:MI AM') AS hpva_time,
      hv.status, hv.symptoms, hv.service, hv.fee, hv.payment_status, 
      hv.receipt_url, hv.meeting_link,
      hv.who_will_see, hv.patient_seen_before, hv.notes, 
      hv.created_at, hv.updated_at , 
      CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
            ELSE NULL 
          END AS profile_image,
      u.full_name
    FROM hp_virtual_appointment hv
    JOIN profile p ON hv.u_id = p.user_id
    JOIN users u ON hv.u_id = u.id
    WHERE hv.hp_id = $1 
      AND (hv.hpva_date > CURRENT_DATE OR (hv.hpva_date = CURRENT_DATE AND hv.hpva_time >= CURRENT_TIME))
    ORDER BY hv.hpva_date ASC, hv.hpva_time ASC;
  `;
    const result = await pool.query(query, [hpId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
};

// Approve the virtual appointment by the healthcare provider
const approveVirtualAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const query = `
      UPDATE hp_virtual_appointment
      SET status = 'approved'
      WHERE hpva_id = $1 AND status = 'pending'
      RETURNING *;
    `;
    const result = await pool.query(query, [appointmentId]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Appointment not found or already approved." });
    }

    const appointment = result.rows[0];

    // Format the appointment date and time
    const formattedTime = formatTime(appointment.hpva_time); // e.g., "1:00 PM"
    const formattedDate = formatDate(appointment.hpva_date); // e.g., "16 Dec 2024"

    // Notify the user directly
    await notifyUser(
      appointment.u_id, // Pass user ID from query result
      `Your virtual consultation at ${formattedTime} on ${formattedDate} has been approved.`,
      "appointment_approved"
    );

    res.status(200).json({
      message: "Appointment approved successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Error approving appointment:", error);
    res.status(500).json({ error: "Failed to approve appointment" });
  }
};

// Function to update virtual appointment status
const updateVirtualAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status, paymentStatus } = req.body; // Extract status and paymentStatus from the request body

  try {
    const query = `
      UPDATE hp_virtual_appointment
      SET status = $1, payment_status = $2
      WHERE hpva_id = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [
      status,
      paymentStatus,
      appointmentId,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Appointment not found." });
    }

    const appointment = result.rows[0];

    // Format the appointment date and time
    const formattedTime = formatTime(appointment.hpva_time); // e.g., "1:00 PM"
    const formattedDate = formatDate(appointment.hpva_date); // e.g., "16 Dec 2024"

    // Prepare the notification message based on the new status
    let message;
    let notificationType;

    if (status === "approved") {
      message = `Your virtual consultation at ${formattedTime} on ${formattedDate} has been approved.`;
      notificationType = "appointment_approved"; // Set notification type for approved status
    } else if (status === "canceled") {
      message = `Your virtual consultation has been canceled.`;
      notificationType = "appointment_status_update"; // Set notification type for canceled status
    }

    // Send the notification to the user
    if (message) {
      await notifyUser(appointment.u_id, message, notificationType);
    }

    res.status(200).json({
      message: "Appointment status updated successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Failed to update appointment status" });
  }
};

// Function to get appointment details by hp_app_id
const getVirtualAppointmentDetailsByHpAppId = async (req, res) => {
  const { hpva_id } = req.params; // Get hp_app_id from request parameters

  try {
    const query = `
      SELECT 
        hv.hpva_id, hv.hp_id, hv.u_id, 
        TO_CHAR(hv.hpva_date, 'YYYY-MM-DD') AS hpva_date,
        TO_CHAR(hv.hpva_time, 'HH12:MI AM') AS hpva_time,
        hv.duration, hv.status, hv.meeting_link, hv.notes, 
        hv.created_at, hv.updated_at, hv.payment_status, 
        hv.fee, hv.receipt_url, hv.service, hv.symptoms, 
        hv.who_will_see, hv.patient_seen_before,
        CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
            ELSE NULL 
        END AS profile_image,
        p.gender,
        u.full_name,
        u.phone_no
      FROM hp_virtual_appointment hv
      JOIN profile p ON hv.u_id = p.user_id
      JOIN users u ON hv.u_id = u.id
      WHERE hv.hpva_id = $1;  -- Use hpva_id for the WHERE clause
    `;

    const result = await pool.query(query, [hpva_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json(result.rows[0]); // Return the first row of the result
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Failed to fetch appointment details." });
  }
};

// Delete respectively virtual appointment
const deleteVirtualSingleAppointment = async (req, res) => {
  const { hpva_id } = req.params;

  try {
    const query = `
      DELETE FROM hp_virtual_appointment
      WHERE hpva_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [hpva_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

// Function to get past virtual appointments
const getPastVirtualAppointments = async (req, res) => {
  const { hpId } = req.params;

  try {
    const query = `
      SELECT 
        hv.hpva_id, hv.hp_id, hv.u_id, 
        TO_CHAR(hv.hpva_date, 'YYYY-MM-DD') AS hpva_date,
        TO_CHAR(hv.hpva_time, 'HH12:MI AM') AS hpva_time,
        hv.status, hv.symptoms, hv.service, hv.fee, hv.payment_status, 
        hv.receipt_url, 
        hv.who_will_see, hv.patient_seen_before, hv.notes, 
        hv.created_at, hv.updated_at,
        CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
            ELSE NULL 
          END AS profile_image,
          u.full_name
      FROM hp_virtual_appointment hv
      JOIN profile p ON hv.u_id = p.user_id
      JOIN users u ON hv.u_id = u.id
      WHERE hv.hp_id = $1 
      AND hv.hpva_date < CURRENT_DATE
      ORDER BY hv.hpva_date DESC, hv.hpva_time DESC;
    `;

    const result = await pool.query(query, [hpId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching past appointments:", error);
    res.status(500).json({ error: "Failed to fetch past appointments" });
  }
};

// Function to update virtual appointment meeting link for the patient
const updateVirtualAppointmentMeetingLink = async (req, res) => {
  const { hpva_id } = req.params;
  const { meetingLink } = req.body; // Added meetingLink to request body

  try {
    const query = `
      UPDATE hp_virtual_appointment
      SET meeting_link = $1
      WHERE hpva_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [meetingLink, hpva_id]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Appointment not found." });
    }

    const appointment = result.rows[0];

    res.status(200).json({
      message: "Meeting link updated successfully.",
      appointment: appointment,
    });
  } catch (error) {
    console.error("Error updating meeting link:", error);
    res.status(500).json({ error: "Failed to update meeting link" });
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
  getVirtualAvailabilityDetails,
  upsertVirtualConsultation,
  deleteVirtualConsultation,
  getUpcomingVirtualAppointments,
  approveVirtualAppointment,
  updateVirtualAppointmentStatus,
  getVirtualAppointmentDetailsByHpAppId,
  deleteVirtualSingleAppointment,
  getPastVirtualAppointments,
  updateVirtualAppointmentMeetingLink,
};
