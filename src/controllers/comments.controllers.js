import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comments.models.js";
import mongoose from "mongoose";

const addComments = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;

  if (!isValidObjectId(videoId) || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid ID provided!");
  }

  if ([content].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "Comment text can't be empty!!");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found!!");
  }

  const comment = await Comment.create({
    content,
    videoId,
    owner: userId,
  });

  if (!comment) {
    throw new ApiError(400, "Error while commenting!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid video id");
  }

  if ([content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Comment content cannot be empty");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  if (!comment) {
    throw new ApiError(400, "Comment not found!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment updated Successfully!!!"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    throw new ApiError(
      400,
      "Unable to delete comment at this moment!! Please try again!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment delete Successfully"));
});

const getAllVideoComments = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const video_id = req.params.id;

  if (!isValidObjectId(video_id)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const isVideo = await Video.findById(video_id);

  if (!isVideo) {
    throw new ApiError(400, "Video not Found!!!");
  }
  const options = {
    page,
    limit,
  };

  const findCommentsOnVideo = Comment.aggregate([
    {
      $match: {
        videoId: new mongoose.Types.ObjectId(video_id),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const result = await Comment.aggregatePaginate(findCommentsOnVideo, options);

  if (result.totalDocs === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Be the first one to Comment!!"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comment fetch Successfully!!!"));
});

export { addComments, updateComment, deleteComment, getAllVideoComments };
