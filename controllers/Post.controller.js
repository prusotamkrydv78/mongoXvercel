import PostModel from "../models/Post.model.js";

export const newPost = (req, res) => {
  res.render("new-post", {
    title: "BlogVerse - New Post",
    user: req.user,
  });
};

export const createNewPost = async (req, res) => {
  try {
    const newPost = await new PostModel(req.body);
    newPost.creator = req.user._id;
    newPost.image = "upcomming feature";
    await newPost.save();
    res.redirect("/posts");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error,post creating", error });
  }
};
