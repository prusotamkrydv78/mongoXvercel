import PostModel from "../models/Post.model.js";

export const getAllPosts = async (req, res) => {
  const allPosts = await PostModel.find();
  console.log(allPosts);
  res.render("explore", {
    title: "BlogVerse - Posts",
    user: req.user,
    posts: allPosts,
  });
};
