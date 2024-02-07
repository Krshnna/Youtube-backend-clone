import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    return new ApiError(400, "Invalid channel ID");
  }
  const channel = await User.findById(channelId);

  if (!channel) {
    return new ApiError(404, "Channel not found");
  }

  const subscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });
  if (!subscription) {
    const createSubscriber = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    if (!createSubscriber) {
      throw new ApiError(400, "Error while subscribing!!!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          createSubscriber,
          "Channel Subscribed Succesfully!!!"
        )
      );
  } else {
    const removeSubscriber = await Subscription.deleteOne({
      subscriber: req.user._id,
      channel: channelId,
    });
    if (!removeSubscriber) {
      throw new ApiError(400, "Error while Unsubscribing!!!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Channel Unsubscribed Successfully!!"));
  }
});

const getuserChannelSubscriber = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  const isChannel = await User.findById(channelId);
  if (!isChannel) {
    throw new ApiError(400, "Channel Doesn't Exists!!!");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberCount",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscriberInfo: {
          $first: "$subscriberCount",
        },
        subscriberCount: {
          $size: "$subscriberCount",
        },
      },
    },
  ]);

  if (subscribers.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "User have no subscribers yet!!!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers Fetched Successfully!!!")
    );
});

const getSubscribedChannel = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;

  const channels = await Subscription.aggregate([
    {
        $match: {
            subscriber: new mongoose.Types.ObjectId(subscriberId)
        }
    }, {
        $lookup: {
            from: "users",
            localField: "channel",
            foreignField: "_id",
            as: "subscribedTo",
            pipeline: [
                {
                    $project: {
                        fullname: 1,
                        username: 1,
                        avatar: 1,
                    }
                }
            ]
        }
    }, 
  ])
  console.log(channels);
  if(channels.length === 0) {
    return res.status(200).json(new ApiResponse(200, {}, "User is not subscribed to any Channel"));
  }

  return res.status(200)
  .json(new ApiResponse(200, channels, "Details Fetched Successfully!!!"));

});

export { toggleSubscription, getuserChannelSubscriber, getSubscribedChannel };
