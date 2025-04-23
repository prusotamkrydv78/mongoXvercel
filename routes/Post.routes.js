import express from "express";
import { createNewPost, newPost } from "../controllers/Post.controller.js";

const PostRoutes = express.Router();
PostRoutes.get("/new-post", newPost);

PostRoutes.post("/new-post", createNewPost);

export default PostRoutes;
