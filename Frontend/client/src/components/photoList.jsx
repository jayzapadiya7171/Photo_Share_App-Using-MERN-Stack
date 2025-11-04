import React from "react";
import API from "../api";
import "../App.css";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const PhotoList = ({ photos, fetchPhotos, user }) => {
  const handleLike = async (id) => {
    if (!user) return alert("Please log in to like photos");
    try {
      await API.put(`/photos/${id}/like`);
      fetchPhotos();
    } catch (error) {
      console.error("Error toggling like:", error);
      alert(error.response?.data?.message || "Error toggling like");
    }
  };

  const handleDelete = async (id) => {
    if (!user) return alert("Please log in to delete photos");
    if (window.confirm("Delete this photo?")) {
      try {
        await API.delete(`/photos/${id}`);
        fetchPhotos();
      } catch (error) {
        console.error("Error deleting photo:", error);
        alert(error.response?.data?.message || "Error deleting photo");
      }
    }
  };

  return (
    <div className="photo-grid">
      {photos.length === 0 && <p>No photos yet. Upload one!</p>}

      {photos.map((p) => {
        const isLiked = p.likes?.includes(user?._id);

        return (
          <div key={p._id} className="photo-card">
            <img
              src={`http://localhost:5000${p.image}`}
              alt={p.title}
              className="photo-image"
            />
            <h4>{p.title}</h4>
            {p.user && <p className="photo-owner">by {p.user.name}</p>}

            <div className="photo-actions">
              {user ? (
                <>
                  {/* ❤️ Like */}
                  <div className="like-section">
                    <button
                      className={`like-btn ${isLiked ? "liked" : ""}`}
                      onClick={() => handleLike(p._id)}
                    >
                      {isLiked ? "💖" : "🤍"}
                    </button>
                    <span className="like-count">
                      {p.likes?.length || 0}{" "}
                      {p.likes?.length === 1 ? "like" : "likes"}
                    </span>
                  </div>

                  {/* 🗑 Delete */}
                  {user._id === p.user?._id && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p._id)}
                    >
                      🗑 Delete
                    </button>
                  )}
                </>
              ) : (
                <span className="like-count">
                  {p.likes?.length || 0}{" "}
                  {p.likes?.length === 1 ? "like" : "likes"}
                </span>
              )}
            </div>

            {/* 💬 Comments */}
            <div className="comments-section">
              <h5>Comments</h5>
              <CommentList photoId={p._id} />
              {user && (
                <CommentForm photoId={p._id} onCommentAdded={fetchPhotos} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoList;
