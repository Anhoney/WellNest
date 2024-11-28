//userAppointmentsController.js
const pool = require("../config/db");

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
        // searchQuery ? `%${searchQuery}%` : null, // Match the search query
        // location ? `%${location}%` : null, // Match the location
        // isWeekday ? "weekday" : isWeekend ? "weekend" : null, // Day category
        // dayOfWeek, // Numeric day of the week
      ]
    );
    console.log({
      searchQueryWords: searchQueryWords.length > 0 ? searchQueryWords : null,
      locationWords: locationWords.length > 0 ? locationWords : null,
      dayCategory: isWeekday ? "weekday" : isWeekend ? "weekend" : null,
      numericDayOfWeek: dayOfWeek,
    });

    res.status(200).json(doctors.rows);
    // console.log("Doctors found:", doctors.rows);
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({ error: "Failed to search doctors" });
  }
};

// Get available times for a specific doctor
const getAvailableTimes = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    console.log("Doctor ID:", doctorId);
    console.log("Date:", date);

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

    console.log("Day of the week:", dayOfWeek);
    console.log("Day category:", dayCategory);
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

    console.log("Available times:", availableTimes);
    console.log("UserId getAvailableTime:", userId);
    // Fetch booked times from hp_appointments
    //     const bookedAppointmentsQuery = `
    // SELECT app_time AS time
    // FROM hp_appointments
    // WHERE hp_id = $1 AND app_date = $2
    // `;
    //     const bookedAppointments = await pool.query(bookedAppointmentsQuery, [
    //       userId,
    //       date,
    //     ]);

    //     // Fetch booked times from hp_virtual_appointment
    //     const virtualAppointmentsQuery = `
    // SELECT hpva_time AS time
    // FROM hp_virtual_appointment
    // WHERE hp_id = $1 AND hpva_date = $2
    // `;
    //     const virtualAppointments = await pool.query(virtualAppointmentsQuery, [
    //       userId,
    //       date,
    //     ]);

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
    // const bookedTimes = [
    //   ...bookedAppointments.rows.map((appt) => appt.time),
    //   ...virtualAppointments.rows.map((vAppt) => vAppt.time),
    // ];

    const bookedTimes = bookedAppointments.rows.map((appt) => appt.time);
    console.log("Booked times:", bookedTimes);

    // Convert booked times to 'hh:mm AM/PM' format
    const convertTo12HourFormat = (time) => {
      const [hours, minutes] = time.split(":");
      const period = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
      return `${adjustedHours}:${minutes.padStart(2, "0")} ${period}`;
    };

    const bookedTimes12Hour = bookedTimes.map(convertTo12HourFormat);
    console.log("Booked times in 12-hour format:", bookedTimes12Hour);

    // Normalize availableTimes to replace non-breaking spaces with regular spaces
    const normalizedAvailableTimes = availableTimes.map((time) =>
      time.replace(/\u202F/g, " ")
    );

    // Filter available times
    const filteredTimes = normalizedAvailableTimes.filter(
      (time) => !bookedTimes12Hour.includes(time)
    );
    // // Filter available times
    // const filteredTimes = availableTimes.filter(
    //   (time) => !bookedTimes.includes(time)
    // );

    // Filter available times
    // const filteredTimes = availableTimes.filter(
    //   (time) => !bookedTimes12Hour.includes(time)
    // );

    console.log("Filtered Available Times:", filteredTimes);
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

  // Log the exact time received and its length for debugging purposes
  console.log("Received time:", time);
  console.log("Length of received time:", time.length);

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
  const { doctorId, date, time } = req.body;
  const userId = req.userId; // Get userId from the authenticated request
  console.log("Booking Appointment", userId, doctorId, date, time);

  if (!userId) {
    return res.status(401).json({ error: "User  not authenticated" });
  }

  try {
    // Convert the provided time to 24-hour format
    const convertedTime = convertTo24HourFormat(time);
    console.log("Converted time:", convertedTime);

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
    await pool.query(
      `INSERT INTO hp_appointments (u_id, hp_id, app_date, app_time, app_status, app_sickness, app_description, app_address)
         VALUES ($1, $2, $3, $4, 'pending', NULL, NULL, NULL)`, // Assuming 'pending' status by default, and other fields as NULL
      [userId, hpId, date, convertedTime]
    );

    res.status(201).json({ message: "Appointment booked successfully" });
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
    console.log("Category received on backend:", category);

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
          p.phone_number,
          p.experience,
          p.business_hours,
          p.business_days,
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
          a.hospital_address
        FROM hp_profile p
        JOIN hp_availability a ON p.user_id = a.user_id
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

module.exports = {
  searchDoctors,
  getAvailableTimes,
  bookAppointment,
  getCategories, // Export the new function
  getDoctorsByCategory,
  addRating,
  getDoctorAppointmentDetails,
};
