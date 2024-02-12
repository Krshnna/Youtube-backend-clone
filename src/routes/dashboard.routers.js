import express from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/channel-stats").get(isAuthenticated, getChannelStats);
router.route("/all-videos").get(isAuthenticated, getChannelVideos);

export default router;