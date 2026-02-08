const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movieController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// PUBLIC (доступны всем)
router.get("/", movieController.getMovies);
router.get("/:id", movieController.getMovieById);

// ADMIN ONLY (RBAC)
router.post("/", auth, role("admin"), movieController.createMovie);
router.put("/:id", auth, role("admin"), movieController.updateMovie);
router.delete("/:id", auth, role("admin"), movieController.deleteMovie);

module.exports = router;
