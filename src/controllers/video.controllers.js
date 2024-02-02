import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {Video} from "../models/video.models.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if ([title, description].some((fields) => fields?.trim === "")) {
    throw new ApiResponse(400, "All fields are required");
  }

  const videoLocalPath = req.files?.video[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if(!videoLocalPath) {
    throw new ApiError(400, "Upload Video!!!");
  }
  if(!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail is required!!");
  }
  const videofile = await UploadOnCloudinary(videoLocalPath);
  const thumbnail = await UploadOnCloudinary(thumbnailLocalPath);

  if(!videofile || !thumbnail) {
    throw new ApiError(400, "Error while uploading files!!");
  }
  const videos = await Video.create({
    videoFile: {
        public_id: videofile.public_id,
        url: videofile.url
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

  if(!videos) {
    throw new ApiError(400, "Error while uploading video. Please try again!!");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Video Uploaded Successfully!!")
  );
});

export {uploadVideo};