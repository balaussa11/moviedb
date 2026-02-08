const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
  getMyReviews
} = require("../controllers/userController");

router.post("/favorites/:movieId", authMiddleware, addToFavorites);
router.get("/favorites", authMiddleware, getFavorites);


router.get("/reviews", authMiddleware, getMyReviews);
router.delete("/favorites/:movieId", authMiddleware, removeFromFavorites);

module.exports = router;
