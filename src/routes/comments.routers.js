import express from "express";
import { addComments, deleteComment, getAllVideoComments, updateComment } from "../controllers/comments.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/add-comment/:id").post(isAuthenticated, addComments);
router.route("/update-comment/:id").patch(isAuthenticated, updateComment);
router.route("/delete-comment/:id").delete(isAuthenticated, deleteComment);
router.route("/fetch-comments/:id").get(isAuthenticated, getAllVideoComments);
export default router;
