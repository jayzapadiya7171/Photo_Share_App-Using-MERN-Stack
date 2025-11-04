import React, { useState } from "react";
import API from "../api"; // ✅ use your axios instance with withCredentials: true

const CommentForm = ({ photoId, fetchComments }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await API.post(
        `/comments/${photoId}`,
        { text },
        { withCredentials: true } // ✅ ensures cookie sent
      );

      setText("");
      if (fetchComments) fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment");
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default CommentForm;
