import Comment from "../models/commentModel.js";
import Photo from "../models/photoModel.js";

// 🟩 Get comments by photo
export const getCommentsByPhoto = async (req, res) => {
  try {
    const comments = await Comment.find({ photo: req.params.photoId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟦 Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { photoId } = req.params;

    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ message: "Photo not found" });

    const comment = await Comment.create({
      text,
      user: req.user._id,
      photo: photoId,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟥 Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
