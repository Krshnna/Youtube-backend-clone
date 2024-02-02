import { Router } from "express";
import { changePassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logout, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage, updateUserAvatar } from "../controllers/user.controllers.js";
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
router.route("/change-password").post(isAuthenticated, changePassword);
router.route("/get-current-user").get(isAuthenticated, getCurrentUser);
router.route("/update-account-details").patch(isAuthenticated, updateAccountDetails);
router.route("/update-avatar").patch(isAuthenticated, upload.single("avatar"), updateUserAvatar);
router.route("/update-coverImage").patch(isAuthenticated, upload.single("coverImage"), updateCoverImage);
router.route("/getUserWatchHistory").get(isAuthenticated, getWatchHistory);

export default router;
