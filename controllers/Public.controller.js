import PostModel from "../models/Post.model.js";

export const getAllPosts = async (req, res) => {
  const allPosts = await PostModel.find().populate("creator");
  res.render("explore", {
    title: "BlogVerse - Posts",
    user: req.user,
    posts: allPosts,
  });
};

export const home = async (req, res) => {
  const allPosts = await PostModel.find().populate("creator");
  res.render("home", {
    title: "BlogVerse - Home",
    posts: allPosts,
    user: req.user,
  });
};
export const about = (req, res) => {
  res.render("about", {
    title: "BlogVerse - About Us",
    user: req.user,
  });
};
export const contact = (req, res) => {
  res.render("contact", {
    title: "BlogVerse - Contact Us",
    user: req.user,
  });
};
export const categories = (req, res) => {
  res.render("categories", {
    title: "BlogVerse - Categories",
    user: req.user,
  });
};

export const post = async (req, res) => {
  const post = await PostModel.findById(req.params.id).populate("creator");
  const relatedPosts = await PostModel.find({ _id: { $ne: req.params.id } });
  if (!post) {
    return res.status(404).render("404", {
      title: "BlogVerse - Not Found",
      user: req.user,
    });
  }
  res.render("post", {
    title: `BlogVerse - ${post.title}`,
    post,
    user: req.user,
    relatedPosts,
  });
};

export const posts = async (req, res) => {
  const user = req.user;
  if(user === null){
    return res.status(401).render("401", {
      title: "BlogVerse - Unauthorized",
      user: req.user,
    });
  }
  const posts = await PostModel.find({ creator: user._id });
  console.log(posts);
  res.render("posts", {
    title: "BlogVerse - My Posts",
    user: req.user,
    posts,
  });
}
