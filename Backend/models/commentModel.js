import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: "Photo", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
