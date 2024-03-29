import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRoutes from "./routes/user.routers.js";
import videoRoutes from "./routes/video.routers.js";
import commentRoutes from "./routes/comments.routers.js";
import playlistRoutes from "./routes/playlist.routers.js";
import subscriptionRoutes from "./routes/subscription.routers.js";
import tweetRoutes from "./routes/tweet.routers.js";
import likeRoutes from "./routes/like.routers.js";
import dashboardRoutes from "./routes/dashboard.routers.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

export default app;
