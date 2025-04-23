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
    // Set creator ID
    newPost.creator = req.user._id;

    // Handle image upload
    let imageUrl =
      "https://res.cloudinary.com/dt38kxhnc/image/upload/v1710400850/default-post-image_wnhcun.jpg";

    // Check if file was uploaded
    if (req.file) {
      // Use the path from multer
      imageUrl = req.file.path;
      console.log("Single file uploaded:", req.file);
    } else if (req.files && req.files.length > 0) {
      // If using array upload
      imageUrl = req.files[0].path;
      console.log("Multiple files uploaded:", req.files);
    }

    newPost.image = imageUrl;
    await newPost.save();
    res.status(201).redirect("/posts");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error,post creating", error });
  }
};

export const handleImageUpload = (req, res) => {
  res.json({
    message: "Upload successful!",
    url: req.file.path,
  });
};
