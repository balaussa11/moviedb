const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(express.static("public"));

// ROUTES
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); 

// ROUTES MIDDLEWARE
app.use("/movies", movieRoutes);
app.use("/reviews", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes); 


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
