const Movie = require("../models/Movie");
const Review = require("../models/Review");

// CREATE
exports.createMovie = async (req, res) => {
  try {
    const { name, genre, year, director, description, type } = req.body;

    const movie = await Movie.create({
      name,
      genre,
      year,
      director,
      description,
      type
    });

    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL (with avg rating)
// READ ALL (with avg rating + reviews)
exports.getMovies = async (req, res) => {
  try {
    let filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const movies = await Movie.find(filter);

    const moviesWithData = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ movie: movie._id })
          .populate("user", "email");

        const avgRating =
          reviews.length === 0
            ? null
            : (
                reviews.reduce((sum, r) => sum + r.rating, 0) /
                reviews.length
              ).toFixed(1);

        return {
          ...movie.toObject(),
          avgRating,
          reviews
        };
      })
    );

    res.json(moviesWithData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// READ ONE (with avg rating)
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const reviews = await Review.find({ movie: movie._id });
    const ratedReviews = reviews.filter(
  r => typeof r.rating === "number"
);

const avgRating =
  ratedReviews.length === 0
    ? null
    : (
        ratedReviews.reduce((sum, r) => sum + r.rating, 0) /
        ratedReviews.length
      ).toFixed(1);


    res.json({
      ...movie.toObject(),
      avgRating
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};

// UPDATE
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
};
