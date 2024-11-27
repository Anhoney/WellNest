// appointmentsController.js
const pool = require("../config/db");

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
  console.log("Appointment data received:", req.body);

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
    console.log("Pool object:", pool);
    const result = await pool.query(query, [
      description,
      location,
      availableDays,
      availableTimes,
      category,
      hospitalAdds,
      userId,
    ]);
    console.log(result.data);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Function to fetch appointments for a specific user
const getAppointments = async (req, res) => {
  const { userId } = req.params;
  console.log("User ID:", userId);
  try {
    const result = await pool.query(
      "SELECT id, description, location, hospital_address,available_days, available_times, category, created_at FROM hp_availability WHERE user_id = $1",
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
  console.log("Fetching appointment with ID:", appointmentId); // Log the appointment ID

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

    console.log("Query result:", result.rows); // Log the result of the query

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};
module.exports = {
  createAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointment,
  getSingleAppointment,
};
