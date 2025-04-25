import express from "express";
import { createComment } from "../controllers/Comment.controller.js";
const CommentsRoutes = express.Router();
CommentsRoutes.post("/:id/comment", createComment);

export default CommentsRoutes;
