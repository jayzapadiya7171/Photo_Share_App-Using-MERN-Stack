import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile", { withCredentials: true }); // ✅ sends cookie
        setProfile(res.data.user);
      } catch (error) {
        console.error("Auth failed, redirecting...");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return <div className="profile-loading">Loading your profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
            alt="User Avatar"
            className="profile-avatar"
          />
          <h2>{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>

        <div className="profile-body">
          <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          
        </div>

        <div className="profile-footer">
          <button className="edit-btn" onClick={() => navigate("/profile/edit")}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
