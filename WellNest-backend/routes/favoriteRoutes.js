// routes/favouriteRoute.js
const express = require("express");
const {
  toggleFavorite,
  getFavorites,
  virtualToggleFavorite,
  virtualGetFavorites,
} = require("../controllers/favoritesController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// Route to toggle a favorite item (add/remove from favorites)
router.post("/toggleFavorite", authenticateToken, toggleFavorite);

// Route to retrieve all favorite items for a user
router.get("/getFavorites", authenticateToken, getFavorites);

// Route to virtually toggle a favorite item
router.post("/virtualToggleFavorite", authenticateToken, virtualToggleFavorite);

// Route to retrieve virtual favorite items
router.get("/virtualGetFavorites", authenticateToken, virtualGetFavorites);

module.exports = router;
