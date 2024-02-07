import express from "express";
import {
  getSubscribedChannel,
  getuserChannelSubscriber,
  toggleSubscription,
} from "../controllers/subscriber.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
const router = express.Router();

router
  .route("/toggle-subscription/:channelId")
  .post(isAuthenticated, toggleSubscription);

router
  .route("/get-user-subscribers/:channelId")
  .get(isAuthenticated, getuserChannelSubscriber);
router
  .route("/get-subscribed-channel")
  .get(isAuthenticated, getSubscribedChannel);

export default router;
