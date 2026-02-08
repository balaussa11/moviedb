const User = require("../models/User");

// ADD TO FAVORITES
exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.movieId)) {
      user.favorites.push(req.params.movieId);
      await user.save();
    }

    res.json({ message: "Added to favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET FAVORITES
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Review = require("../models/Review");

// GET MY REVIEWS
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user.id
    }).populate("movie", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// REMOVE FROM FAVORITES
exports.removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favorites = user.favorites.filter(
      id => id.toString() !== movieId
    );

    await user.save();
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
