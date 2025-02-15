//userAppointmentsController.js
const pool = require("../config/db");
const { API_BASE_URL } = require("../config/config");
const { notifyUser, createNotification } = require("./notificationController"); // Import createNotification

// Search for doctors
const searchDoctors = async (req, res) => {
  const { searchQuery, location, date } = req.body;

  // Check if the date is provided and parse it to get the day of the week
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const parsedDate = new Date(date); // Parse the date string into a Date object
  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  // Get the numeric day of the week (0 = Sunday, ..., 6 = Saturday)
  const dayOfWeek = parsedDate.getDay(); // JavaScript getDay() method returns 0-6 // Numeric day of the week (0-6)

  // Determine the category of the day: weekday, weekend, or everyday
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Saturday-Sunday

  // Split searchQuery and location into words for flexible matching
  const searchQueryWords = searchQuery ? searchQuery.trim().split(/\s+/) : [];
  const locationWords = location ? location.trim().split(/\s+/) : [];

  try {
    const doctors = await pool.query(
      `SELECT p.id, p.username, p.specialist, p.hospital, 
        CASE 
          WHEN p.profile_image IS NOT NULL 
          THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
          ELSE NULL 
        END AS profile_image,
       p.rating, a.location, a.category,a.available_days, a.available_times, a.id
       FROM hp_profile p
       JOIN hp_availability a ON p.user_id = a.user_id
       WHERE ($1::TEXT[] IS NULL OR (
            SELECT COUNT(*) FROM unnest($1::TEXT[]) AS word 
            WHERE p.username ILIKE CONCAT('%', word, '%')
          ) = cardinality($1::TEXT[])) -- Match all words in username
        AND ($2::TEXT[] IS NULL OR (
            SELECT COUNT(*) FROM unnest($2::TEXT[]) AS word 
            WHERE a.location ILIKE CONCAT('%', word, '%')
          ) = cardinality($2::TEXT[])) -- Match all words in location
        AND (
            a.available_days = 'Everyday' -- Available everyday
          OR (a.available_days = 'Every Weekday' AND $3 = 'weekday') -- Available weekdays
          OR (a.available_days = 'Every Weekend' AND $3 = 'weekend') -- Available weekends
          OR $4::TEXT = ANY (string_to_array(a.available_days, ',')) -- Specific day
          )`,
      [
        searchQueryWords.length > 0 ? searchQueryWords : null, // Words from searchQuery
        locationWords.length > 0 ? locationWords : null, // Words from location
        isWeekday ? "weekday" : isWeekend ? "weekend" : null, // Day category
        dayOfWeek.toString(), // Numeric day of the week as a string
      ]
    );

    res.status(200).json(doctors.rows);
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({ error: "Failed to search doctors" });
  }
};

// Get available times for a specific doctor
const getAvailableTimes = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    // Validate input
    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ error: "Doctor ID and Date are required." });
    }

    // Parse the date to find the day of the week
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const dayOfWeek = parsedDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayCategory =
      dayOfWeek === 0 || dayOfWeek === 6 ? "Every Weekend" : "Every Weekday"; // Determine the day category

    // Fetch user_id from hp_availability using doctorId
    const userIdQuery = `
    SELECT user_id, available_times, available_days 
    FROM hp_availability 
    WHERE id = $1
    `;
    const userIdResult = await pool.query(userIdQuery, [doctorId]);

    if (userIdResult.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const {
      user_id: userId,
      available_times: availableTimes,
      available_days: availableDays,
    } = userIdResult.rows[0];

    // Check if the day matches the available_days
    const isAvailable =
      availableDays === "Everyday" ||
      (availableDays === "Every Weekday" && dayCategory === "Every Weekday") ||
      (availableDays === "Every Weekend" && dayCategory === "Every Weekend");

    if (!isAvailable) {
      return res.json([]); // No availability for the given day
    }

    // Fetch booked times from both tables
    const bookedAppointmentsQuery = `
    SELECT app_time AS time FROM hp_appointments 
    WHERE hp_id = $1 AND app_date = $2
    UNION
    SELECT hpva_time AS time FROM hp_virtual_appointment 
    WHERE hp_id = $1 AND hpva_date = $2
    `;
    const bookedAppointments = await pool.query(bookedAppointmentsQuery, [
      userId,
      date,
    ]);

    // Combine all booked times
    const bookedTimes = bookedAppointments.rows.map((appt) => appt.time);

    // Convert booked times to 'hh:mm AM/PM' format
    const convertTo12HourFormat = (time) => {
      const [hours, minutes] = time.split(":");
      const period = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
      return `${adjustedHours}:${minutes.padStart(2, "0")} ${period}`;
    };

    const bookedTimes12Hour = bookedTimes.map(convertTo12HourFormat);

    // Normalize availableTimes to replace non-breaking spaces with regular spaces
    const normalizedAvailableTimes = availableTimes.map((time) =>
      time.replace(/\u202F/g, " ")
    );

    // Filter available times
    const filteredTimes = normalizedAvailableTimes.filter(
      (time) => !bookedTimes12Hour.includes(time)
    );

    res.status(200).json(filteredTimes); // Send the filtered times
  } catch (error) {
    console.error("Error fetching available times:", error);
    res.status(500).json({ error: "An error occurred while fetching times." });
  }
};

const convertTo24HourFormat = (time) => {
  // Check if the time is defined and is a string
  if (!time || typeof time !== "string") {
    throw new Error("Invalid time format: Time must be a string");
  }

  // Normalize the time string by trimming and replacing any non-standard whitespace characters
  time = time.trim().replace(/\s+/g, " "); // Replace multiple whitespace characters with a single space

  // Regular expression to match a 12-hour time format (e.g., "11:00 AM", "12:30 PM")
  const timeFormat = /^(\d{1,2}):(\d{2}) (AM|PM)$/i;

  // Attempt to match the time string against the regular expression
  const match = time.match(timeFormat);
  if (!match) {
    throw new Error("Invalid time format: Expected format is 'hh:mm AM/PM'");
  }

  let [_, hours, minutes, period] = match;

  // Convert string values to numbers
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  // Convert the time to 24-hour format
  if (period.toUpperCase() === "PM" && hours !== 12) {
    hours += 12; // If it's PM and the hour is less than 12, add 12 hours
  } else if (period.toUpperCase() === "AM" && hours === 12) {
    hours = 0; // If it's 12 AM, set hour to 0 (midnight)
  }

  // Ensure hours, minutes, and seconds are in the correct format
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:00`;

  // Return the time in 'HH:MM:SS' format for PostgreSQL TIME without timezone
  return formattedTime;
};

// Book an appointment
const bookAppointment = async (req, res) => {
  const {
    doctorId,
    date,
    time,
    medicalCoverage,
    whoWillSee,
    patientSeenBefore,
    note,
    app_status,
    app_sickness,
    app_description,
    app_address,
  } = req.body;

  const userId = req.userId; // Get userId from the authenticated request

  if (!userId) {
    return res.status(401).json({ error: "User  not authenticated" });
  }

  try {
    // Convert the provided time to 24-hour format
    const convertedTime = convertTo24HourFormat(time);

    // Fetch the doctor (hp_id) from the hp_availability table using the doctorId (availability_id)
    const availabilityQuery = await pool.query(
      `SELECT user_id FROM hp_availability WHERE id = $1`,
      [doctorId]
    );

    if (availabilityQuery.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const hpId = availabilityQuery.rows[0].user_id; // Get the hp_id (doctor's id) from the availability table

    // Check if the user already has a booking on the same date and time
    const existingAppointmentQuery = `
    SELECT 1 FROM hp_appointments 
    WHERE u_id = $1 AND hp_id = $2 AND app_date = $3 AND app_time = $4
    UNION
    SELECT 1 FROM hp_virtual_appointment 
    WHERE u_id = $1 AND hp_id = $2 AND hpva_date = $3 AND hpva_time = $4
    `;
    const existingAppointment = await pool.query(existingAppointmentQuery, [
      userId,
      hpId,
      date,
      convertedTime,
    ]);

    if (existingAppointment.rows.length > 0) {
      return res.status(400).json({
        error: "You already have an appointment at this time.",
      });
    }

    // Check if the time slot is already booked by another user
    const timeSlotQuery = `
    SELECT 1 FROM hp_appointments 
    WHERE hp_id = $1 AND app_date = $2 AND app_time = $3
    UNION
    SELECT 1 FROM hp_virtual_appointment 
    WHERE hp_id = $1 AND hpva_date = $2 AND hpva_time = $3
    `;
    const timeSlotTaken = await pool.query(timeSlotQuery, [
      hpId,
      date,
      convertedTime,
    ]);

    if (timeSlotTaken.rows.length > 0) {
      return res.status(400).json({
        error: "This time slot is already booked by another user.",
      });
    }

    // Insert the appointment into the hp_appointments table
    const insertAppointmentQuery = await pool.query(
      `INSERT INTO hp_appointments (
        u_id, 
        hp_id, 
        app_date, 
        app_time, 
        app_status, 
        medical_coverage, 
        who_will_see, 
        patient_seen_before, 
        note, 
        app_sickness
      )
      VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9)
      RETURNING hp_app_id`, // Add the RETURNING clause to get the last inserted ID
      [
        userId,
        hpId,
        date,
        convertedTime,
        medicalCoverage,
        whoWillSee,
        patientSeenBefore,
        note,
        app_sickness,
      ]
    );

    const appointmentId = `physical_${insertAppointmentQuery.rows[0].hp_app_id}`;

    // Notify user
    await notifyUser(
      hpId,
      `A new physical appointment has been scheduled for ${date} at ${time}. Please approve it.`,
      "appointment_notification"
    );

    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointmentId });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
};

// Fetch unique categories
const getCategories = async (req, res) => {
  try {
    const categories = await pool.query(
      `SELECT DISTINCT category 
         FROM hp_availability`
    );

    if (categories.rows.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }

    res.status(200).json(categories.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Fetch doctors by category
const getDoctorsByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    const doctors = await pool.query(
      `SELECT 
          p.id, 
          p.username, 
          a.category,
          CASE 
          WHEN p.profile_image IS NOT NULL 
          THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
          ELSE NULL 
        END AS profile_image,
          p.rating ,
          p.hospital,
          a.location, 
          a.id
        FROM hp_profile p
        JOIN hp_availability a ON p.user_id = a.user_id
        WHERE a.category = $1`,
      [category]
    );

    if (doctors.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found for this category" });
    }

    res.status(200).json(doctors.rows);
  } catch (error) {
    console.error("Error fetching doctors by category:", error);
    res.status(500).json({ error: "Failed to fetch doctors by category" });
  }
};

// Add a new rating for a doctor
const addRating = async (req, res) => {
  const { userId, doctorId, rating, reviewText } = req.body;

  try {
    // Insert the user's rating and review into the ratings table
    await pool.query(
      `INSERT INTO ratings (user_id, doctor_id, rating, review_text)
         VALUES ($1, $2, $3, $4)`,
      [userId, doctorId, rating, reviewText]
    );

    // Recalculate the average rating for the doctor and update hp_profile
    await pool.query(
      `UPDATE hp_profile
      SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM ratings
        WHERE doctor_id = $1
      )
      WHERE id = $1`,
      [doctorId]
    );

    res.status(201).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ error: "Failed to add rating" });
  }
};

// Fetch doctor details including profile and availability
const getDoctorAppointmentDetails = async (req, res) => {
  const { doctorId } = req.params; // Get doctorId from route params

  try {
    // Query to fetch doctor details from hp_profile and hp_availability tables
    const doctorDetails = await pool.query(
      `
        SELECT 
          p.username,
          p.education,
          p.experience,
          p.credentials,
          p.languages,
          p.services,
          p.business_hours,
          p.business_days,
          p.summary,
          CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN ENCODE(p.profile_image, 'base64') 
            ELSE NULL 
          END AS profile_image,
          p.rating,
          p.user_id,
          a.description,
          a.location,
          a.available_days,
          a.available_times,
          a.category,
          a.hospital_address,
          u.healthcare_license,
          u.email, 
          u.full_name,
          u.phone_no
        FROM hp_profile p
        JOIN hp_availability a ON p.user_id = a.user_id
        JOIN users u ON p.user_id = u.id
        WHERE a.id = $1
        `,
      [doctorId] // Use the doctorId to filter by hp_availability primary ID
    );

    // Check if the doctor details were found
    if (doctorDetails.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Respond with the doctor details
    res.status(200).json(doctorDetails.rows[0]);
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    res.status(500).json({ error: "Failed to fetch doctor details" });
  }
};

// Fetch all scheduled appointments for a user
const getScheduledAppointments = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get appointments from hp_appointments table
    const appointmentsQuery = await pool.query(
      `
      SELECT 
        ha.hp_app_id AS appointment_id, 
        ha.hp_id, 
        ha.u_id, 
        NULL AS health_record, 
        ha.app_date AS appointment_date, 
        ha.app_time AS appointment_time, 
        ha.app_status AS status, 
        NULL AS meeting_link, 
        ha.note AS notes, 
        ha.created_at AS appointment_created_at,  -- Specify the table alias
        ha.updated_at AS appointment_updated_at,  -- Specify the table alias
        NULL AS payment_status,  -- No payment_status in hp_appointments
        NULL AS fee,  -- No fee in hp_appointments
        p.username AS doctor_name,
        p.specialist AS doctor_specialization,
        a.category,
        a.location,
        CASE 
          WHEN p.profile_image IS NOT NULL 
          THEN ENCODE(p.profile_image, 'base64') 
          ELSE NULL 
        END AS profile_image,
        'physical' AS appointment_type  -- Add appointment type
      FROM hp_appointments ha
      JOIN hp_profile p ON ha.hp_id = p.user_id
      JOIN hp_availability a ON ha.hp_id = a.user_id
      WHERE ha.u_id = $1 AND (ha.app_date + ha.app_time::interval) > NOW(); -- Combine date and time
      `,
      [userId]
    );

    // Get virtual appointments from hp_virtual_appointment table
    const virtualAppointmentsQuery = await pool.query(
      `
      SELECT 
        hv.hpva_id AS appointment_id, 
        hv.hp_id, 
        hv.u_id, 
        NULL AS health_record, 
        hv.hpva_date AS appointment_date, 
        hv.hpva_time AS appointment_time, 
        hv.status, 
        hv.meeting_link, 
        hv.notes, 
        hv.created_at AS appointment_created_at,  -- Specify the table alias
        hv.updated_at AS appointment_updated_at,  -- Specify the table alias
        hv.payment_status,  -- payment_status exists only in virtual appointments
        hv.fee,  -- fee exists only in virtual appointments
        p.username AS doctor_name,
        p.specialist AS doctor_specialization,
        a.category,
        a.location,
        CASE 
          WHEN p.profile_image IS NOT NULL 
          THEN ENCODE(p.profile_image, 'base64') 
          ELSE NULL 
        END AS profile_image,
        'virtual' AS appointment_type  -- Add appointment type
      FROM hp_virtual_appointment hv
      JOIN hp_profile p ON hv.hp_id = p.user_id
      JOIN hp_availability a ON hv.hp_id = a.user_id
      WHERE hv.u_id = $1 AND (hv.hpva_date + hv.hpva_time::interval) > NOW(); -- Combine date and time
      `,
      [userId]
    );

    // Combine both results (appointments and virtual appointments)
    const allUpcomingAppointments = [
      ...appointmentsQuery.rows.map((row) => ({
        ...row,
        appointment_id: `physical_${row.appointment_id}`, // Add prefix for physical appointments
      })),
      ...virtualAppointmentsQuery.rows.map((row) => ({
        ...row,
        appointment_id: `virtual_${row.appointment_id}`, // Add prefix for virtual appointments
      })),
    ];

    // Sort the combined result by appointment date
    allUpcomingAppointments.sort((a, b) => {
      const dateA = new Date(a.appointment_date + " " + a.appointment_time);
      const dateB = new Date(b.appointment_date + " " + b.appointment_time);
      return dateA - dateB;
    });

    // Fetch past appointments for both tables
    const pastAppointmentsQuery = await pool.query(
      `
      SELECT 
        ha.hp_app_id AS appointment_id, 
        ha.hp_id, 
        ha.u_id, 
        NULL AS health_record, 
        ha.app_date AS appointment_date, 
        ha.app_time AS appointment_time, 
        ha.app_status AS status, 
        NULL AS meeting_link, 
        ha.note AS notes, 
        ha.created_at AS appointment_created_at,  -- Specify the table alias
        ha.updated_at AS appointment_updated_at,  -- Specify the table alias
        NULL AS payment_status,  -- No payment_status in hp_appointments
        NULL AS fee,  -- No fee in hp_appointments
        p.username AS doctor_name,
        p.specialist AS doctor_specialization,
        a.category,
        a.location,
        CASE 
          WHEN p.profile_image IS NOT NULL 
          THEN ENCODE(p.profile_image, 'base64') 
          ELSE NULL 
        END AS profile_image,
        'physical' AS appointment_type  -- Add appointment type
      FROM hp_appointments ha
      JOIN hp_profile p ON ha.hp_id = p.user_id
      JOIN hp_availability a ON ha.hp_id = a.user_id
      WHERE ha.u_id = $1 AND (ha.app_date + ha.app_time::interval) <= NOW(); -- Combine date and time
      `,
      [userId]
    );

    const virtualPastAppointmentsQuery = await pool.query(
      `
      SELECT 
        hv.hpva_id AS appointment_id, 
        hv.hp_id, 
        hv.u_id, 
        NULL AS health_record, hv.hpva_date AS appointment_date, 
        hv.hpva_time AS appointment_time, 
        hv.status, 
        hv.meeting_link, 
        hv.notes, 
        hv.created_at AS appointment_created_at,  -- Specify the table alias
        hv.updated_at AS appointment_updated_at,  -- Specify the table alias
        hv.payment_status,  -- payment_status exists only in virtual appointments
        hv.fee,  -- fee exists only in virtual appointments
        p.username AS doctor_name,
        p.specialist AS doctor_specialization,
        a.hospital_address,
        a.category,
        a.location,
        CASE 
          WHEN p.profile_image IS NOT NULL 
          THEN ENCODE(p.profile_image, 'base64') 
          ELSE NULL 
        END AS profile_image,
        'virtual' AS appointment_type  -- Add appointment type
      FROM hp_virtual_appointment hv
      JOIN hp_profile p ON hv.hp_id = p.user_id
      JOIN hp_availability a ON hv.hp_id = a.user_id
      WHERE hv.u_id = $1 AND (hv.hpva_date + hv.hpva_time::interval) <= NOW(); -- Combine date and time
      `,
      [userId]
    );

    // Combine past appointments
    const allPastAppointments = [
      ...pastAppointmentsQuery.rows.map((row) => ({
        ...row,
        appointment_id: `physical_${row.appointment_id}`, // Prefix for physical appointments
      })),
      ...virtualPastAppointmentsQuery.rows.map((row) => ({
        ...row,
        appointment_id: `virtual_${row.appointment_id}`, // Prefix for virtual appointments
      })),
    ];

    // Sort the combined result by appointment date in descending order (for past appointments)
    allPastAppointments.sort((a, b) => {
      const dateA = new Date(a.appointment_date + " " + a.appointment_time);
      const dateB = new Date(b.appointment_date + " " + b.appointment_time);
      return dateB - dateA; // Sort in descending order for past appointments
    });

    // Send both sorted lists to the frontend
    res.json({
      upcoming: allUpcomingAppointments,
      past: allPastAppointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const userIdFromQuery = req.query.userId; // Extract userId from query params

  // Check if appointmentId exists and is a valid string
  if (!appointmentId || typeof appointmentId !== "string") {
    return res.status(400).json({
      error: "Appointment ID is required and should be a valid string.",
    });
  }

  try {
    // Extract the appointment type and numeric ID
    const parts = appointmentId.split("_");

    // Ensure the appointmentId is in the expected format (e.g., "physical_35" or "virtual_4")
    if (parts.length !== 2) {
      return res.status(400).json({
        error:
          "Invalid appointment ID format. Expected format: <type>_<numeric_id>",
      });
    }

    const appointmentType = parts[0]; // "physical" or "virtual"
    const appointmentNumericId = parts[1]; // "35" or "4"

    // Validate that the numeric ID is a valid number
    if (!appointmentNumericId || isNaN(appointmentNumericId)) {
      return res
        .status(400)
        .json({ error: "Invalid numeric part of the appointment ID." });
    }

    // Choose the table and query based on the appointment type
    let appointmentCheckQuery = "";
    let appointmentCheckParams = [appointmentNumericId];
    let userId = null; // To store user ID from the appointment record

    if (appointmentType === "physical") {
      appointmentCheckQuery = `SELECT hp_id FROM hp_appointments WHERE hp_app_id = $1`;
    } else if (appointmentType === "virtual") {
      appointmentCheckQuery = `SELECT hp_id FROM hp_virtual_appointment WHERE hpva_id = $1`;
    } else {
      return res.status(400).json({
        error: "Invalid appointment type. Expected 'physical' or 'virtual'.",
      });
    }

    // Check if the appointment exists in the corresponding table
    const appointmentCheck = await pool.query(
      appointmentCheckQuery,
      appointmentCheckParams
    );

    // If the appointment is not found
    if (appointmentCheck.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Extract the user ID from the query result
    userId = appointmentCheck.rows[0].hp_id;

    if (!userId) {
      return res.status(500).json({
        error: "Failed to retrieve user information for notification.",
      });
    }

    // Proceed to delete from the corresponding table
    let deleteQuery = "";
    if (appointmentType === "physical") {
      deleteQuery = `DELETE FROM hp_appointments WHERE hp_app_id = $1`;
    } else if (appointmentType === "virtual") {
      deleteQuery = `DELETE FROM hp_virtual_appointment WHERE hpva_id = $1`;
    }

    await pool.query(deleteQuery, [appointmentNumericId]);

    // Notify the user about the cancellation
    const notificationMessage = `Your ${
      appointmentType === "physical" ? "physical" : "virtual"
    } appointment with ID ${appointmentNumericId} has been canceled.`;

    try {
      await notifyUser(userId, notificationMessage, "appointment_cancellation");
    } catch (notifyError) {
      console.error("Error notifying user:", notifyError);
      // Optionally, you can return a warning about the notification failure without breaking the main cancellation flow.
    }

    res.json({ success: true, message: "Appointment cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ error: "Failed to cancel appointment." });
  }
};

// Fetch appointment details
const getAppointmentDetails = async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    // Determine the appointment type and ID
    const isVirtual = appointmentId.startsWith("virtual_");
    const id = appointmentId.split("_")[1];

    // Query selection based on appointment type
    const query = isVirtual
      ? `
        SELECT 
          hv.hpva_id AS appointment_id, 
          hv.hp_id, 
          hv.u_id, 
          hv.hpva_date AS appointment_date, 
          hv.hpva_time AS appointment_time, 
          hv.duration, 
          hv.status, 
          hv.meeting_link, 
          hv.notes AS notes, 
          hv.payment_status, 
          hv.fee, 
          hv.receipt_url,
          hv.service,
          hv.symptoms,
          NULL AS medical_coverage, 
          NULL AS who_will_see, 
          NULL AS patient_seen_before, 
          NULL AS app_sickness, 
          p.username AS doctor_name,
          p.specialist AS doctor_specialization,
          a.category,
          a.services_provide::text AS services_provide,
          CASE 
            WHEN p.profile_image IS NOT NULL  
            THEN ENCODE(p.profile_image, 'base64') 
            ELSE NULL 
          END AS profile_image,
          up.gender AS gender,
          u.full_name AS full_name
        FROM hp_virtual_appointment hv
        JOIN hp_profile p ON hv.hp_id = p.user_id
        JOIN hp_virtual_availability a ON hv.hp_id = a.hp_id
        JOIN users u ON hv.u_id = u.id
        JOIN profile up ON hv.u_id = up.user_id
        WHERE hv.hpva_id = $1
      `
      : `
        SELECT 
          ha.hp_app_id AS appointment_id, 
          ha.hp_id, 
          ha.u_id, 
          ha.app_date AS appointment_date, 
          ha.app_time AS appointment_time, 
          ha.app_status AS status, 
          ha.medical_coverage, 
          ha.who_will_see, 
          ha.patient_seen_before, 
          ha.app_sickness,
          ha.note AS notes, 
          p.username AS doctor_name,
          p.specialist AS doctor_specialization,
          a.category,
          a.location,
          a.hospital_address,
          CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN ENCODE(p.profile_image, 'base64') 
            ELSE NULL 
          END AS profile_image,
          up.gender AS gender,
          u.full_name AS full_name
        FROM hp_appointments ha
        JOIN hp_profile p ON ha.hp_id = p.user_id
        JOIN hp_availability a ON ha.hp_id = a.user_id
        JOIN users u ON ha.u_id = u.id
        JOIN profile up ON ha.u_id = up.user_id
        WHERE ha.hp_app_id = $1
      `;

    // Execute the query
    const appointmentResult = await pool.query(query, [id]);

    // Check if the appointment exists
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Respond with the appointment details
    res.status(200).json(appointmentResult.rows[0]);
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Failed to fetch appointment details" });
  }
};

// Virtual Consultation
// Search for virtual doctors
const searchVirtualDoctors = async (req, res) => {
  const { searchQuery, date } = req.body;

  // Validate and parse the date to determine the day of the week
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const dayOfWeek = parsedDate.getDay(); // Get the numeric day of the week (0-6)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Saturday-Sunday

  // Split searchQuery into words for flexible matching
  const searchQueryWords = searchQuery ? searchQuery.trim().split(/\s+/) : [];

  try {
    const doctors = await pool.query(
      `SELECT 
        p.id, 
        p.username, 
        p.specialist, 
        CASE 
          WHEN p.profile_image IS NOT NULL 
          THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
          ELSE NULL 
        END AS profile_image, 
        p.rating, 
        a.description, 
        a.services_provide::text AS services_provide, -- Convert JSONB to text
        a.category, 
        a.available_days, 
        a.available_times, 
        a.price, 
        a.bank_receiver_name, 
        a.bank_name, 
        a.account_number, 
        a.id AS virtual_availability_id
       FROM hp_profile p
       JOIN hp_virtual_availability a ON p.user_id = a.hp_id
       WHERE ($1::TEXT[] IS NULL OR (
              SELECT COUNT(*) FROM unnest($1::TEXT[]) AS word 
              WHERE p.username ILIKE CONCAT('%', word, '%')
           ) = cardinality($1::TEXT[])) -- Match all words in username
         AND (
             a.available_days = 'Everyday' -- Available everyday
           OR (a.available_days = 'Every Weekday' AND $2 = 'weekday') -- Available weekdays
           OR (a.available_days = 'Every Weekend' AND $2 = 'weekend') -- Available weekends
           OR $3::TEXT = ANY (string_to_array(a.available_days, ',')) -- Specific day
            )`,
      [
        searchQueryWords.length > 0 ? searchQueryWords : null, // Words from searchQuery
        isWeekday ? "weekday" : isWeekend ? "weekend" : null, // Day category
        dayOfWeek.toString(), // Numeric day of the week as a string
      ]
    );

    res.status(200).json(doctors.rows);
  } catch (error) {
    console.error("Error searching virtual doctors:", error);
    res.status(500).json({ error: "Failed to search virtual doctors" });
  }
};

// Fetch unique categories
const getVirtualCategories = async (req, res) => {
  try {
    const categories = await pool.query(
      `SELECT DISTINCT category 
         FROM hp_virtual_availability`
    );

    if (categories.rows.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }

    res.status(200).json(categories.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Fetch virtual consultation doctors by category
const getVirtualDoctorsByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    const doctors = await pool.query(
      `SELECT 
           p.id, 
           p.username, 
           v.category,
           v.description,
           v.services_provide::text AS services_provide, -- Convert JSONB to text
           v.available_days,
           v.available_times,
           v.bank_receiver_name,
           v.bank_name,
           v.account_number,
           v.id AS virtual_availability_id,
           CASE 
             WHEN p.profile_image IS NOT NULL 
             THEN CONCAT('data:image/png;base64,', ENCODE(p.profile_image, 'base64'))
             ELSE NULL 
           END AS profile_image,
           p.rating
         FROM hp_profile p
         JOIN hp_virtual_availability v ON p.user_id = v.hp_id
         WHERE v.category = $1`,
      [category]
    );

    if (doctors.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No virtual doctors found for this category" });
    }

    res.status(200).json(doctors.rows);
  } catch (error) {
    console.error("Error fetching virtual doctors by category:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch virtual doctors by category" });
  }
};

// Fetch doctor details including profile and availability
const getVirtualDoctorAppointmentDetails = async (req, res) => {
  const { doctorId } = req.params; // Get doctorId from route params

  try {
    // Query to fetch doctor details from hp_profile and hp_availability tables
    const doctorDetails = await pool.query(
      `
        SELECT 
          p.username,
          p.education,
          p.experience,
          p.credentials,
          p.languages,
          p.services,
          p.business_hours,
          p.business_days,
          p.summary,
          CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN ENCODE(p.profile_image, 'base64') 
            ELSE NULL 
          END AS profile_image,
          p.rating,
          p.user_id,
          a.description,
          a.services_provide::text AS services_provide, -- Convert JSONB to text
          a.available_days,
          a.available_times,
          a.category,
          a.bank_receiver_name,
          a.bank_name,
          a.account_number,
          a.hp_id,
          u.healthcare_license,
          u.email, 
          u.full_name,
          u.phone_no
        FROM hp_profile p
        JOIN hp_virtual_availability a ON p.user_id = a.hp_id
        JOIN users u ON p.user_id = u.id
        WHERE a.id = $1
        `,
      [doctorId] // Use the doctorId to filter by hp_availability primary ID
    );

    // Check if the doctor details were found
    if (doctorDetails.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Respond with the doctor details
    res.status(200).json(doctorDetails.rows[0]);
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    res.status(500).json({ error: "Failed to fetch doctor details" });
  }
};

// Get available times for a specific doctor
const getVirtualAvailableTimes = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    // Validate input
    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ error: "Doctor ID and Date are required." });
    }

    // Parse the date to find the day of the week
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const dayOfWeek = parsedDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayCategory =
      dayOfWeek === 0 || dayOfWeek === 6 ? "Every Weekend" : "Every Weekday"; // Determine the day category

    // Fetch user_id from hp_availability using doctorId
    const userIdQuery = `
    SELECT hp_id, available_times, available_days 
    FROM hp_virtual_availability 
    WHERE id = $1
    `;
    const userIdResult = await pool.query(userIdQuery, [doctorId]);

    if (userIdResult.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const {
      hp_id: userId,
      available_times: availableTimes,
      available_days: availableDays,
    } = userIdResult.rows[0];

    // Check if the day matches the available_days
    const isAvailable =
      availableDays === "Everyday" ||
      (availableDays === "Every Weekday" && dayCategory === "Every Weekday") ||
      (availableDays === "Every Weekend" && dayCategory === "Every Weekend");

    if (!isAvailable) {
      return res.json([]); // No availability for the given day
    }

    // Fetch booked times from both tables
    const bookedAppointmentsQuery = `
    SELECT app_time AS time FROM hp_appointments 
    WHERE hp_id = $1 AND app_date = $2
    UNION
    SELECT hpva_time AS time FROM hp_virtual_appointment 
    WHERE hp_id = $1 AND hpva_date = $2
    `;
    const bookedAppointments = await pool.query(bookedAppointmentsQuery, [
      userId,
      date,
    ]);

    const bookedTimes = bookedAppointments.rows.map((appt) => appt.time);

    // Convert booked times to 'hh:mm AM/PM' format
    const convertTo12HourFormat = (time) => {
      const [hours, minutes] = time.split(":");
      const period = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
      return `${adjustedHours}:${minutes.padStart(2, "0")} ${period}`;
    };

    const bookedTimes12Hour = bookedTimes.map(convertTo12HourFormat);

    // Normalize availableTimes to replace non-breaking spaces with regular spaces
    const normalizedAvailableTimes = availableTimes.map((time) =>
      time.replace(/\u202F/g, " ")
    );

    // Filter available times
    const filteredTimes = normalizedAvailableTimes.filter(
      (time) => !bookedTimes12Hour.includes(time)
    );

    res.status(200).json(filteredTimes); // Send the filtered times
  } catch (error) {
    console.error("Error fetching available times:", error);
    res.status(500).json({ error: "An error occurred while fetching times." });
  }
};

// Book a virtual appointment
const bookVirtualAppointment = async (req, res) => {
  const {
    doctorId,
    date,
    time,
    whoWillSee,
    patientSeenBefore,
    note,
    symptoms,
    duration, // Assuming you want to include duration
    meetingLink, // Assuming you want to include a meeting link
    fee, // Assuming you want to include a fee
    receiptUrl,
    services,
  } = req.body;

  const userId = req.userId; // Get userId from the authenticated request

  if (!userId) {
    return res.status(401).json({ error: "User  not authenticated" });
  }

  try {
    // Convert the provided time to 24-hour format
    const convertedTime = convertTo24HourFormat(time);

    // Fetch the doctor (hp_id) from the hp_virtual_availability table using the doctorId
    const availabilityQuery = await pool.query(
      `SELECT hp_id FROM hp_virtual_availability WHERE id = $1`,
      [doctorId]
    );

    if (availabilityQuery.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const hpId = availabilityQuery.rows[0].hp_id; // Correctly get the hp_id from the availability table

    // Check if the user already has a booking on the same date and time
    const existingAppointmentQuery = `
      SELECT 1 FROM hp_appointments 
      WHERE u_id = $1 AND hp_id = $2 AND app_date = $3 AND app_time = $4
      UNION
      SELECT 1 FROM hp_virtual_appointment 
      WHERE u_id = $1 AND hp_id = $2 AND hpva_date = $3 AND hpva_time = $4
    `;
    const existingAppointment = await pool.query(existingAppointmentQuery, [
      userId,
      hpId,
      date,
      convertedTime,
    ]);

    if (existingAppointment.rows.length > 0) {
      return res.status(400).json({
        error: "You already have an appointment at this time.",
      });
    }

    // Check if the time slot is already booked by another user
    const timeSlotQuery = `
      SELECT 1 FROM hp_virtual_appointment 
      WHERE hp_id = $1 AND hpva_date = $2 AND hpva_time = $3
    `;
    const timeSlotTaken = await pool.query(timeSlotQuery, [
      hpId,
      date,
      convertedTime,
    ]);

    if (timeSlotTaken.rows.length > 0) {
      return res.status(400).json({
        error: "This time slot is already booked by another user.",
      });
    }

    // Insert the virtual appointment into the hp_virtual_appointment table
    const insertAppointmentQuery = await pool.query(
      `INSERT INTO hp_virtual_appointment (
        u_id, 
        hp_id, 
        hpva_date, 
        hpva_time, 
        duration, 
        status, 
        meeting_link, 
        notes, 
        created_at, 
        updated_at, 
        payment_status, 
        fee,
        receipt_url, service, symptoms, who_will_see, patient_seen_before
      )
      VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, NOW(), NOW(), 'uncheck', $8, $9, $10, $11, $12, $13)
      RETURNING hpva_id`, // Add the RETURNING clause to get the last inserted ID
      [
        userId,
        hpId,
        date,
        convertedTime,
        duration,
        meetingLink,
        note,
        fee,
        receiptUrl,
        services,
        symptoms,
        whoWillSee,
        patientSeenBefore,
      ]
    );

    const appointmentId = `virtual_${insertAppointmentQuery.rows[0].hpva_id}`;

    // Notify user
    await notifyUser(
      hpId,
      `A new virtual appointment has been scheduled for ${date} at ${time}. Please approve it.`,
      "appointment_notification"
    );

    res.status(201).json({
      message: "Virtual appointment booked successfully",
      appointmentId,
    });
  } catch (error) {
    console.error("Error booking virtual appointment:", error);
    res.status(500).json({ error: "Failed to book virtual appointment" });
  }
};

// Upload receipt by patients
const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Construct the file URL
  const fileUrl = `${API_BASE_URL}/uploads/${req.file.filename}`;

  res.json({ fileUrl });
};
const getVirtualAppointmentDetails = async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    // Determine the appointment type and ID
    const isVirtual = appointmentId.startsWith("virtual_");
    const id = appointmentId.split("_")[1];

    // Query selection based on appointment type
    const query = isVirtual
      ? `
        SELECT 
          hv.hpva_id AS appointment_id, 
          hv.hp_id, 
          hv.u_id, 
          hv.hpva_date AS appointment_date, 
          hv.hpva_time AS appointment_time, 
          hv.status, 
          NULL AS medical_coverage, 
          NULL AS who_will_see, 
          NULL AS patient_seen_before, 
          NULL AS app_sickness, 
          hv.notes AS notes, 
          p.username AS doctor_name,
          p.specialist AS doctor_specialization,
          a.category,
          a.location,
          a.hospital_address,
          CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN ENCODE(p.profile_image, 'base64') 
            ELSE NULL 
          END AS profile_image,
          up.gender AS gender,
          u.full_name AS full_name
        FROM hp_virtual_appointment hv
        JOIN hp_profile p ON hv.hp_id = p.user_id
        JOIN hp_availability a ON hv.hp_id = a.user_id
        JOIN users u ON hv.u_id = u.id
        JOIN profile up ON hv.u_id = up.user_id
        WHERE hv.hpva_id = $1
      `
      : `
        SELECT 
          ha.hp_app_id AS appointment_id, 
          ha.hp_id, 
          ha.u_id, 
          ha.app_date AS appointment_date, 
          ha.app_time AS appointment_time, 
          ha.app_status AS status, 
          ha.medical_coverage, 
          ha.who_will_see, 
          ha.patient_seen_before, 
          ha.app_sickness,
          ha.note AS notes, 
          p.username AS doctor_name,
          p.specialist AS doctor_specialization,
          a.category,
          a.location,
          a.hospital_address,
          CASE 
            WHEN p.profile_image IS NOT NULL 
            THEN ENCODE(p.profile_image, 'base64') 
            ELSE NULL 
          END AS profile_image,
          up.gender AS gender,
          u.full_name AS full_name
        FROM hp_appointments ha
        JOIN hp_profile p ON ha.hp_id = p.user_id
        JOIN hp_availability a ON ha.hp_id = a.user_id
        JOIN users u ON ha.u_id = u.id
        JOIN profile up ON ha.u_id = up.user_id
        WHERE ha.hp_app_id = $1
      `;

    // Execute the query
    const appointmentResult = await pool.query(query, [id]);

    // Check if the appointment exists
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Respond with the appointment details
    res.status(200).json(appointmentResult.rows[0]);
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Failed to fetch appointment details" });
  }
};

module.exports = {
  searchDoctors,
  getAvailableTimes,
  bookAppointment,
  getCategories,
  getDoctorsByCategory,
  addRating,
  getDoctorAppointmentDetails,
  getScheduledAppointments,
  cancelAppointment,
  getAppointmentDetails,
  searchVirtualDoctors,
  getVirtualCategories,
  getVirtualDoctorsByCategory,
  getVirtualDoctorAppointmentDetails,
  getVirtualAvailableTimes,
  bookVirtualAppointment,
  uploadReceipt,
  getVirtualAppointmentDetails,
};
