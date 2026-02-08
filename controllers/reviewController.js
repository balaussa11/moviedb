const Review = require("../models/Review");

// CREATE REVIEW (user / admin)
exports.addReview = async (req, res) => {
  try {
    const { text, rating } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
  text: text || "",   // ← ВАЖНО
  rating,
  movie: req.params.movieId,
  user: req.user.id
});

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ REVIEWS BY MOVIE (public)
exports.getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({
      movie: req.params.movieId
    }).populate("user", "email");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE REVIEW (admin only)
exports.updateReview = async (req, res) => {
  try {
    const { text, rating } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { text, rating },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE REVIEW (admin only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
