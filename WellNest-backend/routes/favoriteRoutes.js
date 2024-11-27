const express = require("express");
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/favoritesController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

router.post("/toggleFavorite", authenticateToken, toggleFavorite);
router.get("/getFavorites", authenticateToken, getFavorites);

module.exports = router;
