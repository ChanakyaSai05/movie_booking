const movieRouter = require("express").Router();

const {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
} = require("../controller/movieController");
const Movie = require("../models/movieModel");
const { validateMovie, validateMongoId } = require("../middlewares/validationMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

movieRouter.post("/add-movie", authMiddleware, ...validateMovie, addMovie);
movieRouter.get("/get-all-movies", getAllMovies);
movieRouter.put("/update-movie", authMiddleware, ...validateMovie, updateMovie);
movieRouter.put("/delete-movie", authMiddleware, deleteMovie);
movieRouter.get("/movie/:id", ...validateMongoId('id'), getMovieById);

module.exports = movieRouter;
