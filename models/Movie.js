const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["movie", "series", "cartoon"],
    required: true
  },
  poster: {
  type: String,
  default: ""
}


}, { timestamps: true });


module.exports = mongoose.model("Movie", movieSchema);
