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
    console.log("Doctors found:", doctors.rows);
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({ error: "Failed to search doctors" });
  }
};

// Get available times for a specific doctor
const getAvailableTimes = async (req, res) => {
  const { doctorId, date } = req.query;

  // Parse the date to get the day of the week
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const dayOfWeek = parsedDate.getDay(); // Numeric day of the week

  try {
    const availability = await pool.query(
      `SELECT available_times
       FROM hp_availability
       WHERE user_id = $1 AND 
       (
           available_days = 'Everyday' 
           OR (available_days = 'Every Weekday' AND $2 BETWEEN 1 AND 5) 
           OR (available_days = 'Every Weekend' AND $2 IN (0, 6)) 
           OR $2::TEXT = ANY(string_to_array(available_days, ',')))
       `,
      [doctorId, dayOfWeek]
    );

    if (availability.rows.length === 0) {
      return res.status(404).json({ message: "No available times found" });
    }

    res.status(200).json(availability.rows[0].available_times);
  } catch (error) {
    console.error("Error fetching available times:", error);
    res.status(500).json({ error: "Failed to fetch available times" });
  }
};

// Book an appointment
const bookAppointment = async (req, res) => {
  const { userId, doctorId, date, time } = req.body;

  try {
    await pool.query(
      `INSERT INTO appointments (user_id, doctor_id, date, time)
       VALUES ($1, $2, $3, $4)`,
      [userId, doctorId, date, time]
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
