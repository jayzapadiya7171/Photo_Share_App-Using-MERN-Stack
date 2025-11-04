import express from "express";
import {
  uploadPhoto,
  getPhotos,
  deletePhoto,
  toggleLike,
} from "../controllers/photoController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Require login for all photo operations
router.get("/", protect, getPhotos);
router.post("/", protect, upload.single("image"), uploadPhoto);
router.delete("/:id", protect, deletePhoto);
router.put("/:id/like", protect, toggleLike);

export default router;
