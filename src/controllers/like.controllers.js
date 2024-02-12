import mongoose, { isValidObjectId } from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Like } from "../models/like.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Comment } from "../models/comments.models.js";
import { Playlist } from "../models/playlist.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found!!!");
  }

  const like = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (!like) {
    const createLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!createLike) {
      throw new ApiError(400, "Error while liking the video!!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createLike, "Video Liked Successfully!!!"));
  } else {
    const removeLike = await like.deleteOne();
    if (!removeLike) {
      if (!createLike) {
        throw new ApiError(400, "Error while disliking the video!!");
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video dislike Successfully!!!"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const user = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }

  const findTweet = await Tweet.findById(tweetId);
  if (!findTweet) {
    throw new ApiError(400, "Tweet Not Found!!!");
  }
  const tweet = await Like.findOne({
    tweet: tweetId,
    likedBy: user,
  });

  if (!tweet) {
    const createTweetLike = await Like.create({
      tweet: tweetId,
      likedBy: user,
    });
    if (!createTweetLike) {
      throw new ApiError(400, "Error while liking the tweet!!!");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, createTweetLike, "Tweet Liked Successfully!!!")
      );
  } else {
    console.log("hiee");
    const removeTweetLike = await tweet.deleteOne();
    if (!removeTweetLike) {
      throw new ApiError(400, "Error while disliking the tweet!!!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet Dislike successfullyy!!!"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const findComment = await Comment.findById(commentId);
  if (!findComment) {
    throw new ApiError(400, "Comment Not Found!!!");
  }

  const comment = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (!comment) {
    const createCommentLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!createCommentLike) {
      throw new ApiError(400, "Error while liking the comment!!!");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, createCommentLike, "Comment Liked Successfully!!!")
      );
  } else {
    const removeLike = await comment.deleteOne();
    if (!removeLike) {
      throw new ApiError(400, "Error while disliking the comment!!!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment disLiked Successfully!!!"));
  }
});

const togglePlaylistLike = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }
  const findPlaylist = await Playlist.findById(playlistId);
  if (!findPlaylist) {
    throw new ApiError(400, "Playlist Not Found!!!");
  }

  const playlist = await Like.findOne({
    playlist: playlistId,
    likedBy: req.user._id,
  });
  if (!playlist) {
    const createPlaylistLike = await Like.create({
      playlist: playlistId,
      likedBy: req.user._id,
    });
    if (!createPlaylistLike) {
      throw new ApiError(400, "Error while liking the playlist!!!");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, createPlaylistLike, "Playlist Liked Successfully")
      );
  } else {
    const removeLike = await playlist.deleteOne();
    if (!removeLike) {
      throw new ApiError(400, "Error while disliking the playlist!!!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist disLiked Successfully!!!"));
  }
});

const getLikeVideos = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const likeVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(user),
        video: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $addFields: {
        videoDetails: {
          $first: "$videoDetails",
        },
      },
    },
  ]);
  if (likeVideos.length === 0) {
    return res.status(200).json(new ApiResponse(200, {}, "No Liked Videos"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likeVideos,
        "All Liked videos Fetched Successfully!!!"
      )
    );
});

const getLikePlaylist = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const likedPlaylist = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(user),
        playlist: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "playlist",
        foreignField: "_id",
        as: "playlistDetails",
      },
    },
    {
      $addFields: {
        playlist: {
          $first: "$playlistDetails",
        },
      },
    },
  ]);
  if (likedPlaylist.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "You have not liked any playlist yet!!!"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedPlaylist,
        "All liked playlist fetched Successfully!!!"
      )
    );
});

export {
  toggleVideoLike,
  toggleTweetLike,
  toggleCommentLike,
  togglePlaylistLike,
  getLikeVideos,
  getLikePlaylist,
};
