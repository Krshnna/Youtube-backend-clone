import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import mongoose from "mongoose";

import {
  UploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if ([title, description].some((fields) => fields?.trim === "")) {
    throw new ApiResponse(400, "All fields are required");
  }

  const videoLocalPath = req.files?.video[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Upload Video!!!");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail is required!!");
  }
  const videofile = await UploadOnCloudinary(videoLocalPath);
  const thumbnail = await UploadOnCloudinary(thumbnailLocalPath);

  if (!videofile || !thumbnail) {
    throw new ApiError(400, "Error while uploading files!!");
  }
  const videos = await Video.create({
    videoFile: {
      public_id: videofile.public_id,
      url: videofile.url,
    },
    thumbnail: {
      public_id: thumbnail.public_id,
      url: thumbnail.url,
    },
    title,
    description,
    duration: videofile.duration,
    owner: req.user._id,
  });

  if (!videos) {
    throw new ApiError(400, "Error while uploading video. Please try again!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Video Uploaded Successfully!!"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video_to_deleted = await Video.findById(videoId);

  if (!video_to_deleted) {
    throw new ApiError(400, "Video not found!!!");
  }

  const deleteVideo = video_to_deleted.videoFile.public_id;
  const deleteThumbnail = video_to_deleted.thumbnail.public_id;

  if (!deleteVideo || !deleteThumbnail) {
    throw new ApiError(400, "Video or thumbnail id not found");
  }

  const removeVideoFromCloudinary = await deleteFromCloudinary(
    deleteVideo,
    "video"
  );
  const removeThumbnailFromCloudinary =
    await deleteFromCloudinary(deleteThumbnail);

  if (!removeThumbnailFromCloudinary || !removeVideoFromCloudinary) {
    throw new ApiError(400, "Error while deleting from cloudinary");
  }

  const deletedvideo = await video_to_deleted.deleteOne();
  if (!deletedvideo) {
    throw new ApiError(
      400,
      "Currently unable to delete video. Please try again!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted Successfully!!"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id!!");
  }

  const { title, description } = req.body;

  const updateDetails = {};
  if (title) {
    updateDetails.title = title;
  }
  if (description) {
    updateDetails.description = description;
  }

  if (Object.keys(updateDetails).length == 0) {
    throw new ApiError(
      400,
      "Atleast one field(title or description) is required!!!"
    );
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: updateDetails,
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(400, "Video not found!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Video details updated Successfully!!!"));
});

const getVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found!!");
  }
  video.views = video.views + 1;
  await video.save();

  const videoDetail = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscriberCount",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "videoComments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullname: 1,
              avatar: 1,
              username: 1,
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        subscriberCount: {
          $size: "$subscriberCount",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user._id, "$subscriberCount.subsriber"] },
            then: true,
            else: false,
          },
        },
        totalComments: {
          $size: "$videoComments",
        },
      },
    },
    {
      $addFields: {
        views: "$views",
        duration: "$duration",
      },
    },
  ]);

  if (!videoDetail) {
    throw new ApiError(400, "Video Not found!!");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, videoDetail[0], "Video fetched Successfully!!!")
    );
});

const updateThumbnail = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  console.log(req.file);

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const cloudinaryUrl = await UploadOnCloudinary(thumbnailLocalPath);

  if (!cloudinaryUrl) {
    throw new ApiError(400, "Unable to upload image on Cloudinary Server");
  }

  let video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found!!");
  }

  const oldThumbnailPublicId = video.thumbnail?.public_id;

  if (!oldThumbnailPublicId) {
    throw new ApiError(404, "thumbnail public_id not found");
  }

  video = await Video.updateOne(
    {
      _id: videoId,
    },
    {
      $set: {
        thumbnail: {
          public_id: cloudinaryUrl.public_id,
          url: cloudinaryUrl.url,
        },
      },
    }
  );

  if (!video) {
    throw new ApiError(
      400,
      "Error while updating thumbnail. Please try again!!"
    );
  }

  const deleteThumbnail = await deleteFromCloudinary(oldThumbnailPublicId);
  if (!deleteThumbnail) {
    throw new ApiError(400, "Error deleting thumbnail from Cloudinary");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Thumbnail Updated SuccessFully!!!"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "asc",
    sortType,
    userId,
  } = req.query;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id");
  }

  if (!query || !sortType) {
    throw new ApiError(400, "All fields are required");
  }

  let user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User Not Found!!");
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };
  let sortOptions = {};

  sortOptions[sortBy] = sortType == "asc" ? 1 : -1;
  if (sortBy == "asc") {
    sortOptions[sortBy] = 1;
  } else sortOptions[sortBy] = -1;

  const VideoAggregate = await Video.aggregate([
    {
      $match: {
        $and: [
          {
            owner: new mongoose.Types.ObjectId(userId),
          },
          {
            title: {
              $regex: query,
              $options: "i", // for case insensitive search
            },
          },
        ],
      },
    },
    {
      $sort: sortOptions,
    },
  ]);
  console.log(VideoAggregate, options);

  if (VideoAggregate.length === 0) {
    return res.status(200).json(new ApiResponse(200, {}, "No video available"));
  }

  const resultedVideo = await Video.aggregatePaginate(VideoAggregate, options);
  return res
    .status(200)
    .json(new ApiResponse(200, resultedVideo, "Videos fetch successfully!!!"));
});

const tooglePublish = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video id!!");
  }

  let video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found!!");
  }
  let isVideoPublished = video.isPublished;

  if (!isVideoPublished) {
    video.isPublished = true;
  } else video.isPublished = false;

  const updatedVideo = await video.save();
  if (!updatedVideo) {
    throw new ApiError(400, "Error while updating video, Please Try Again!!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Status Updated Successfully!!"));
});

export {
  uploadVideo,
  deleteVideo,
  updateVideoDetails,
  getVideo,
  updateThumbnail,
  getAllVideos,
  tooglePublish,
};
