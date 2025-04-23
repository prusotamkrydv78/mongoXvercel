import express from "express";
import {
  createNewPost,
  handleImageUpload,
  newPost,
} from "../controllers/Post.controller.js";
import upload from "../middlewares/Storage.middleware.js";
import isUserlogined from "../middlewares/auth.middleware.js";

const PostRoutes = express.Router();
PostRoutes.get("/new-post", isUserlogined, newPost);

PostRoutes.post(
  "/new-post",

  upload.array("image", 5),
  createNewPost
);

PostRoutes.post("/upload-image", upload.single("image"), handleImageUpload);

export default PostRoutes;
