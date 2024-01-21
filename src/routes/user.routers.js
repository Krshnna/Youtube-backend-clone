import { Router } from "express";
import { getUserChannelProfile, loginUser, logout, refreshAccessToken, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1,
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]),
    registerUser);

router.route("/login").post(loginUser);    
router.route("/logout").post(isAuthenticated, logout);
router.route("/refresh-Token").post(refreshAccessToken);
router.route("/user-channel-profile/:username").get(isAuthenticated,getUserChannelProfile);

export default router;
