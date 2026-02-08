const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Review = require("../models/Review");
const {
  addReview,
  getReviewsByMovie,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

// PUBLIC — reviews for a movie
router.get("/movie/:movieId", getReviewsByMovie);

// USER — add review
router.post("/:movieId", auth, addReview);

// ADMIN — get ALL reviews (for moderation)
router.get("/", auth, role("admin"), async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("movie", "name")
      .populate("user", "email");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN — delete bad review
router.delete("/:reviewId", auth, role("admin"), deleteReview);

module.exports = router;
