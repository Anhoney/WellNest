const pool = require("../config/db");
// Get all care plans
const getAllCarePlans = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM care_plans WHERE user_id = $1 ORDER BY created_at DESC",
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
  const { title, plan } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO care_plans (title, plan, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, plan, user_id]
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
  const { title, plan } = req.body;
  try {
    const result = await pool.query(
      "UPDATE care_plans SET title = $1, plan = $2 WHERE careplan_id = $3 RETURNING *",
      [title, plan, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Care plan updated successfully!",
        carePlan: result.rows[0], // Optionally include the updated care plan
      });
    } else {
      res.status(404).json({ message: "Care plan not found." });
    }
    // res.json(result.rows[0]);
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
