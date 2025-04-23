import express from "express";
import {
  createNewPost,
  handleImageUpload,
  newPost,
} from "../controllers/Post.controller.js";
import upload from "../middlewares/Storage.middleware.js";

const PostRoutes = express.Router();
PostRoutes.get("/new-post", newPost);

PostRoutes.post("/new-post", createNewPost);

PostRoutes.post("/upload-image", upload.single("image"), handleImageUpload);

export default PostRoutes;
