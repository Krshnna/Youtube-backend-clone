import express from "express";
import {
  getLikePlaylist,
  getLikeVideos,
  toggleCommentLike,
  togglePlaylistLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/toggle-video/:videoId").post(isAuthenticated, toggleVideoLike);
router.route("/toggle-tweet/:tweetId").post(isAuthenticated, toggleTweetLike);
router
  .route("/toggle-comment/:commentId")
  .post(isAuthenticated, toggleCommentLike);
router
  .route("/toggle-playlist/:playlistId")
  .post(isAuthenticated, togglePlaylistLike);

router.route("/get-liked-videos").get(isAuthenticated, getLikeVideos);
router.route("/get-liked-playlist").get(isAuthenticated, getLikePlaylist);

export default router;
