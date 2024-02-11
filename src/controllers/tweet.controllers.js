import { Tweet } from "../models/tweet.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const user = req.user._id;
  if (!content) {
    throw new ApiError(400, "Content cannot be empty!!!");
  }

  const tweet = await Tweet.create({
    content,
    owner: user,
  });

  if (!tweet) {
    throw new ApiError(400, "Unable to tweet!!!");
  }
  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created Successfully!!!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );
  if (!tweet) {
    throw new ApiError(400, "Tweet not Found!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated Successfully!!!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User Not found!!!");
  }

  const validateAggregation = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  const options = {
    page,
    limit,
  };

  const userTweets = await Tweet.aggregatePaginate(
    validateAggregation,
    options
  );

  console.log(userTweets);

  if (userTweets.totalDocs === 0) {
    return res.status(200).json(new ApiResponse(200, {}, "No tweets found!!!"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "All tweets fetched Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }

  const deleteTweet = await Tweet.findByIdAndDelete(tweetId);
  if (!deleteTweet) {
    throw new ApiError(400, "Tweet not Found!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet Deleted Successfully!!"));
});

export { createTweet, updateTweet, deleteTweet, getUserTweets };
