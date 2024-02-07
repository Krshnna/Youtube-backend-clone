import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.models.js";
import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;
  const videoId = req.params.id;

  if (!isValidObjectId(userId) || !isValidObjectId(videoId))
    return new ApiError(400, "Invalid User or Video ID");

  if (!name) {
    throw new ApiError(400, "Please provide a playlist name");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
    videos: [videoId],
  });

  if (!playlist) {
    throw new ApiError(400, "Unable to create playlist!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created Successfully!!!"));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id");
  }

  const findPlaylists = await Playlist.find({ owner: userId });
  if (!findPlaylists || !findPlaylists?.length === 0) {
    return res.status(200).json(200, {}, "User has no playlists!!!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, findPlaylists, "Playlist find successfully!!"));
});

const addVideoinPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found!!");
  }

  let tempPlaylist = await Playlist.findById(playlistId);

  let findVideo = tempPlaylist.videos.indexOf(videoId);

  if (findVideo !== -1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video is already in the playlist"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: [videoId],
      },
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    throw new ApiError(400, "Unable to add video into playlist!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video add Successfully!!!"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Playlist not found!!!");
  }

  let index = playlist.videos.indexOf(videoId);

  if (index === -1) {
    throw new ApiError(400, "This Video is not in the playlist.");
  }

  let updatedPlaylist = playlist.videos.splice(videoId, 1);

  if (!updatedPlaylist) {
    throw new ApiError(400, "Unable to delete video from playlist");
  }
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video from delete successfully!!!"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findByIdAndUpdate(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist does not exist!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deteled Successfully!!!"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const { name, description } = req.body;
  const updateDetails = {};
  if (name) updateDetails.name = name;
  if (description) updateDetails.description = description;

  if (Object.keys(updateDetails) === 0) {
    throw new ApiError(
      400,
      "Atleast one field(name or description) is required!!!"
    );
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: updateDetails,
    },
    { new: true }
  );

  if (!playlist) {
    throw new ApiError(400, "Unable to update playlist details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated Successfully!!!"));
});

const getPlaylistById = asyncHandler(async(req, res) => {
    const {playlistId} = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
      }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(400, "Playlist Not Found!!!");
    }

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched Successfully!!!"));
})

export {
  createPlaylist,
  getUserPlaylist,
  addVideoinPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistById,
};
