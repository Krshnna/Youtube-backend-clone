import express from "express";
import { Router } from "express";
import isAuthenticated from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  deleteVideo,
  getAllVideos,
  getVideo,
  tooglePublish,
  updateThumbnail,
  updateVideoDetails,
  uploadVideo,
} from "../controllers/video.controllers.js";

const router = Router();

router.route("/upload-video").post(
  isAuthenticated,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router.route("/delete-video/:id").delete(isAuthenticated, deleteVideo);
router
  .route("/update-video-details/:id")
  .put(isAuthenticated, updateVideoDetails);
router.route("/get-video/:id").get(isAuthenticated, getVideo);
router.route("/update-thumbnail/:id").patch(isAuthenticated, updateThumbnail);
router.route("/get-all-videos/").get(isAuthenticated, getAllVideos);
router.route("/toogle-publish/:id").patch(isAuthenticated, tooglePublish);

export default router;
