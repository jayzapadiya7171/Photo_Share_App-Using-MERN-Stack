import React, { useEffect, useState } from "react";
import axios from "../api.js";
import "./Comment.css";

const CommentList = ({ photoId }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/comments/${photoId}`);
      setComments(data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [photoId, showComments]);

  return (
    <div className="comment-section">
      <button
        className="show-comments-btn"
        onClick={() => setShowComments(!showComments)}
      >
        💬 {showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {showComments && (
        <div className="comments-container">
          <h4>Comments</h4>
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="comment-item">
                <strong>{c.user?.name || "Anonymous"}:</strong> {c.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentList;
