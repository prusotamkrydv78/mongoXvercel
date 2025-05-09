import express from "express";
import {
  about,
  categories,
  contact,
  getAllPosts,
  home,
  post,
  posts,
} from "../controllers/Public.controller.js";
const PublicRouter = express.Router();

PublicRouter.get("/", home);
PublicRouter.get("/explore", getAllPosts);
PublicRouter.get("/about", about);

PublicRouter.get("/contact", contact);

PublicRouter.get("/categories", categories);


PublicRouter.get("/posts/:id",post)
 
PublicRouter.get("/posts",posts);;

export default PublicRouter;
