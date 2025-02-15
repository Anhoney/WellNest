//favoritesController.js
const pool = require("../config/db");

// Function to toggle a physical appointments favorite status for a specific availability
const toggleFavorite = async (req, res) => {
  const { availabilityId } = req.body; // Use availabilityId instead of doctorId
  const userId = req.userId;

  try {
    // Check if the availability is already marked as a favorite
    const existingFavorite = await pool.query(
      "SELECT id FROM favorites WHERE user_id = $1 AND availability_id = $2",
      [userId, availabilityId]
    );

    if (existingFavorite.rows.length > 0) {
      // If already a favorite, remove it
      await pool.query(
        "DELETE FROM favorites WHERE user_id = $1 AND availability_id = $2",
        [userId, availabilityId]
      );
      return res.json({ success: true, message: "Removed from favorites" });
    } else {
      // Otherwise, add to favorites
      await pool.query(
        "INSERT INTO favorites (user_id, availability_id) VALUES ($1, $2)",
        [userId, availabilityId]
      );
      return res.json({ success: true, message: "Added to favorites" });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
};

// Function to toggle a virtual appointmentfavorite status for a specific availability
const virtualToggleFavorite = async (req, res) => {
  const { availabilityId } = req.body; // Use availabilityId instead of doctorId
  const userId = req.userId;

  try {
    // Check if the virtual availability is already marked as a favorite
    const existingFavorite = await pool.query(
      "SELECT id FROM favorites WHERE user_id = $1 AND virtual_availability_id = $2",
      [userId, availabilityId]
    );

    if (existingFavorite.rows.length > 0) {
      // If already a favorite, remove it
      await pool.query(
        "DELETE FROM favorites WHERE user_id = $1 AND virtual_availability_id = $2",
        [userId, availabilityId]
      );
      return res.json({ success: true, message: "Removed from favorites" });
    } else {
      // Otherwise, add to favorites
      await pool.query(
        "INSERT INTO favorites (user_id, virtual_availability_id) VALUES ($1, $2)",
        [userId, availabilityId]
      );
      return res.json({ success: true, message: "Added to favorites" });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
};

// Function to get all favorite physical appointments for a user
const getFavorites = async (req, res) => {
  const userId = req.userId;

  try {
    // Query to fetch all favorites for the user
    const result = await pool.query(
      `SELECT
            f.availability_id,
            a.description,
            a.location,
            a.available_days,
            a.available_times,
            a.category,
            d.username,
            CASE
            WHEN d.profile_image IS NOT NULL
            THEN CONCAT('data:image/png;base64,', ENCODE(d.profile_image, 'base64'))
            ELSE NULL
          END AS profile_image,
            d.rating
         FROM favorites f
         INNER JOIN hp_availability a ON f.availability_id = a.id
         INNER JOIN hp_profile d ON a.user_id = d.user_id
         WHERE f.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorite doctors" });
  }
};

// Function to get all favorite virtual appointments for a user
const virtualGetFavorites = async (req, res) => {
  const userId = req.userId;

  try {
    // Query to fetch all virtual favorites for the user
    const result = await pool.query(
      `SELECT
            f.virtual_availability_id,
            a.description,
            a.services_provide::text AS services_provide, -- Convert JSONB to text
            a.available_days,
            a.available_times,
            a.category,
            d.username,
            CASE
            WHEN d.profile_image IS NOT NULL
            THEN CONCAT('data:image/png;base64,', ENCODE(d.profile_image, 'base64'))
            ELSE NULL
          END AS profile_image,
            d.rating
         FROM favorites f
         INNER JOIN hp_virtual_availability a ON f.virtual_availability_id = a.id
         INNER JOIN hp_profile d ON a.hp_id = d.user_id
         WHERE f.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorite doctors" });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
  virtualToggleFavorite,
  virtualGetFavorites,
};
