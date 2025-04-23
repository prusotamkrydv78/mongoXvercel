import express from 'express'
import { getAllPosts } from '../controllers/Public.controller.js';
const PublicRouter = express.Router()
PublicRouter.get("/explore", getAllPosts);

export default PublicRouter