import express from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/create-tweet").post(isAuthenticated, createTweet);
router.route("/update-tweet/:tweetId").put(isAuthenticated, updateTweet);
router.route("/delete-tweet/:tweetId").delete(isAuthenticated, deleteTweet);
router.route("/get-user-tweet").get(isAuthenticated, getUserTweets);

export default router;
