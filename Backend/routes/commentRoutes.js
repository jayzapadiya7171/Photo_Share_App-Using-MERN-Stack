import express from "express";
import {
  getCommentsByPhoto,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all comments for a photo
router.get("/:photoId", getCommentsByPhoto);

// ✅ Add a comment (requires login)
router.post("/:photoId", protect, addComment);

// ✅ Delete comment (optional — only owner or admin)
router.delete("/:id", protect, deleteComment);

export default router;
