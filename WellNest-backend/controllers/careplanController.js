//careplanController.js
const pool = require("../config/db");

// Get all care plans
const getAllCarePlans = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT cp.*, u.full_name, p.username FROM care_plans cp LEFT JOIN users u ON cp.writer_id = u.id LEFT JOIN profile p ON cp.writer_id = p.user_id WHERE cp.user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new care plan
const createCarePlan = async (req, res) => {
  const { user_id } = req.params;
  const { title, plan, writerId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO care_plans (title, plan, user_id, writer_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, plan, user_id, writerId]
    );
    // Send a success message along with the created care plan
    res.status(201).json({
      message: "Care plan created successfully!",
      carePlan: result.rows[0], // Optionally include the created care plan
    });
    // res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a care plan
const updateCarePlan = async (req, res) => {
  const { id } = req.params;
  const { title, plan, writerId } = req.body;
  try {
    const result = await pool.query(
      "UPDATE care_plans SET title = $1, plan = $2, writer_id = $3 WHERE careplan_id = $4 RETURNING *",
      [title, plan, writerId, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Care plan updated successfully!",
        carePlan: result.rows[0], // Optionally include the updated care plan
      });
    } else {
      res.status(404).json({ message: "Care plan not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a care plan
const deleteCarePlan = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM care_plans WHERE careplan_id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCarePlans,
  createCarePlan,
  updateCarePlan,
  deleteCarePlan,
};
