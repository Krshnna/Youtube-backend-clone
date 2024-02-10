import { Tweet } from "../models/tweet.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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

export { createTweet };
