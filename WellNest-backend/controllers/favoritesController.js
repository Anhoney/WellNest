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
const virtualToggleFavorite = async (req, res) => {
  const { availabilityId } = req.body; // Use availabilityId instead of doctorId
  const userId = req.userId;

  console.log("Request Body:", req.body);
  console.log("User  ID:", userId); // Log userId to see if it's null
  console.log("Availability ID:", availabilityId); // Log availabilityId to verify it's set

  try {
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

// const toggleFavorite = async (req, res) => {
//   const { availabilityId, virtualAvailabilityId } = req.body; // Accept both IDs
//   const userId = req.userId;

//   if (!availabilityId && !virtualAvailabilityId) {
//     return res.status(400).json({
//       error: "Either availabilityId or virtualAvailabilityId is required.",
//     });
//   }

//   try {
//     // Query for existing favorite based on the provided ID
//     const existingFavorite = await pool.query(
//       `SELECT id FROM favorites
//        WHERE user_id = $1
//        AND (availability_id = $2 OR virtual_availability_id = $3)`,
//       [userId, availabilityId || null, virtualAvailabilityId || null]
//     );

//     if (existingFavorite.rows.length > 0) {
//       // If already a favorite, remove it
//       await pool.query(
//         `DELETE FROM favorites
//          WHERE user_id = $1
//          AND (availability_id = $2 OR virtual_availability_id = $3)`,
//         [userId, availabilityId || null, virtualAvailabilityId || null]
//       );
//       return res.json({ success: true, message: "Removed from favorites" });
//     } else {
//       // Otherwise, add to favorites
//       await pool.query(
//         `INSERT INTO favorites (user_id, availability_id, virtual_availability_id)
//          VALUES ($1, $2, $3)`,
//         [userId, availabilityId || null, virtualAvailabilityId || null]
//       );
//       return res.json({ success: true, message: "Added to favorites" });
//     }
//   } catch (error) {
//     console.error("Error toggling favorite:", error);
//     res.status(500).json({ error: "Failed to toggle favorite" });
//   }
// };

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

const virtualGetFavorites = async (req, res) => {
  const userId = req.userId;

  console.log("User  ID:", userId);

  try {
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

// const getFavorites = async (req, res) => {
//   const userId = req.userId;

//   try {
//     const result = await pool.query(
//       `SELECT
//           f.id,
//           f.availability_id,
//           f.virtual_availability_id,
//           a.location,
//           COALESCE(a.description, v.description) AS description,
//           COALESCE(a.available_days, v.available_days) AS available_days,
//           COALESCE(a.available_times, v.available_times) AS available_times,
//           COALESCE(a.category, v.category) AS category,
//           d.username,
//           CASE
//             WHEN d.profile_image IS NOT NULL
//             THEN CONCAT('data:image/png;base64,', ENCODE(d.profile_image, 'base64'))
//             ELSE NULL
//           END AS profile_image,
//           d.rating,
//           CASE
//             WHEN f.availability_id IS NOT NULL THEN 'physical'
//             WHEN f.virtual_availability_id IS NOT NULL THEN 'virtual'
//           END AS appointment_type
//         FROM favorites f
//         LEFT JOIN hp_availability a ON f.availability_id = a.id
//         LEFT JOIN hp_virtual_availability v ON f.virtual_availability_id = v.id
//         INNER JOIN hp_profile d ON d.user_id = COALESCE(a.user_id, v.hp_id)
//         WHERE f.user_id = $1`,
//       [userId]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching favorites:", error);
//     res.status(500).json({ error: "Failed to fetch favorite doctors" });
//   }
// };

module.exports = {
  toggleFavorite,
  getFavorites,
  virtualToggleFavorite,
  virtualGetFavorites,
};
