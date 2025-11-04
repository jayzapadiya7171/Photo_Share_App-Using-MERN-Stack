import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/profile",
          { withCredentials: true }
        );

        setFormData((prev) => ({
          ...prev,
          name: res.data.user.name,
          email: res.data.user.email,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error loading profile", error);
        navigate("/login"); // if no cookie / token expired
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation for password
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      return alert("❌ New passwords do not match!");
    }

    try {
      await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        { withCredentials: true }
      );

      alert("✅ Profile Updated Successfully!");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <h3 className="edit-loading">Loading...</h3>;

  return (
    <div className="edit-container">
      <form className="edit-card" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

       

      

        <label>Current Password</label>
        <input
          type="password"
          name="currentPassword"
          placeholder="Enter current password"
          onChange={handleChange}
        />

        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          onChange={handleChange}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          onChange={handleChange}
        />

        <button type="submit" className="save-btn">💾 Save Changes</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>
          ❌ Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
