import express from "express";
import {
  addVideoinPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/create-playlist/:id").post(isAuthenticated, createPlaylist);
router.route("/delete-playlist/:id").delete(isAuthenticated, deletePlaylist);
router.route("/find-playlist/:id").get(isAuthenticated, getUserPlaylist);
router
  .route("/add-video/:playlistId/:videoId")
  .patch(isAuthenticated, addVideoinPlaylist);
router
  .route("/remove-video/:playlistId/:videoId")
  .delete(isAuthenticated, removeVideoFromPlaylist);
router
  .route("/update-playlist/:playlistId")
  .put(isAuthenticated, updatePlaylist);

router.route("/get-playlist-by-id/:playlistId").get(isAuthenticated, getPlaylistById);
export default router;
