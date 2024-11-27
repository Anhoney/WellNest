//favoritesController.js
const pool = require("../config/db");

const toggleFavorite = async (req, res) => {
  const { availabilityId } = req.body; // Use availabilityId instead of doctorId
  const userId = req.userId;

  console.log("Request Body:", req.body);
  console.log("User  ID:", userId); // Log userId to see if it's null
  console.log("Availability ID:", availabilityId); // Log availabilityId to verify it's set

  try {
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

const getFavorites = async (req, res) => {
  const userId = req.userId;

  console.log("User  ID:", userId);

  try {
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

    // Map the rows and add a data URI prefix for Base64 images
    // const favorites = result.rows.map((doctor) => ({
    //   ...doctor,
    //   profile_image: doctor.profile_image
    //     ? `data:image/png;base64,${doctor.profile_image}`
    //     : null, // Use `null` or a placeholder if no image exists
    // }));

    // res.json(favorites);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorite doctors" });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
};
