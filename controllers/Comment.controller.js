import CommentModel from "../models/Comment.model.js";
import PostModel from "../models/Post.model.js";

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    const newComment = new CommentModel({
      content,
      author: user._id,
      post: post._id,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    user.comments.push(newComment._id);
    await user.save();
    res.status(201).redirect(`/posts/${postId}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
