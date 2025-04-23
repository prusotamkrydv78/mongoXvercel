import File_UploadModel from "../models/File_Upload.model.js";
import PostModel from "../models/Post.model.js";

export const newPost = (req, res) => {
  res.render("new-post", {
    title: "BlogVerse - New Post",
    user: req.user,
  });
};

export const createNewPost = async (req, res) => {
  const { title, content } = req.body;
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  const images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File_UploadModel({
        url: file.path,
        public_id: file.filename,
        author: req.user._id,
      });
      await newFile.save();
      return newFile;
    })
  );
  const newPost = new PostModel({
    title,
    content,
    images,
    creator: req.user._id,
  });
  await newPost.save();
  res.status(201).redirect("/posts");
};
export const handleImageUpload = (req, res) => {
  res.json({
    message: "Upload successful!",
    url: req.file.path,
  });
};
