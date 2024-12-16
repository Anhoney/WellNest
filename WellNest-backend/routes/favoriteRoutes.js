const express = require("express");
const {
  toggleFavorite,
  getFavorites,
  virtualToggleFavorite,
  virtualGetFavorites,
} = require("../controllers/favoritesController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

router.post("/toggleFavorite", authenticateToken, toggleFavorite);
router.get("/getFavorites", authenticateToken, getFavorites);
router.post("/virtualToggleFavorite", authenticateToken, virtualToggleFavorite);
router.get("/virtualGetFavorites", authenticateToken, virtualGetFavorites);

module.exports = router;
