const express = require("express");
const router = express.Router();
const {
  getAllCarePlans,
  createCarePlan,
  updateCarePlan,
  deleteCarePlan,
} = require("../controllers/careplanController");
const authenticateToken = require("../middleware/authMiddleware");

// Get all care plans
router.get("/careplan/:user_id", authenticateToken, getAllCarePlans);

// Create a new care plan
router.post("/create/careplan/:user_id", authenticateToken, createCarePlan);

// Update a care plan
router.put("/update/careplan/:id", authenticateToken, updateCarePlan);

// Delete a care plan
router.delete("/careplan/:id", authenticateToken, deleteCarePlan);

module.exports = router;
