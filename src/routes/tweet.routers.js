import express from "express";
import { createTweet } from "../controllers/tweet.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/create-tweet").post(isAuthenticated, createTweet);

export default router;