import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import mongoose from "mongoose";

const getChannelStats = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const getViewsAndVideosCount = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(user),
      },
    },
    {
      $group: {
        _id: "$owner",
        totalViews: {
          $sum: "$views",
        },
        totalVideos: {
          $sum: 1,
        },
      },
    },
  ]);
  const totalSubscriber = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(user),
      },
    },
    {
      $group: {
        _id: "$channel",
        totalSubscriber: {
          $sum: 1,
        },
      },
    },
  ]);

  const channelStats = {
    getViewsAndVideosCount,
    totalSubscriber,
  };

  if (getViewsAndVideosCount.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, channelStats, "User has not published any videos")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel Stats Fetch Successfully!!!")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const video = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  console.log(video);

  if (video.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User has not uploaded any video yet!"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetch Successfully!!!"));
});

export { getChannelStats, getChannelVideos };
