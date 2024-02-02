import express from "express";
import { Router } from "express";
import isAuthenticated from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { uploadVideo } from "../controllers/video.controllers.js";

const router = Router();

router.route("/upload-video").post(isAuthenticated, upload.fields([
    {
        name: "video",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    }
]), uploadVideo);

export default router;