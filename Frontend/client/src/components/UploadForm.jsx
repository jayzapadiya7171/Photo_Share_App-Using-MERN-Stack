import React, { useState } from "react";
import API from "../api";

const UploadForm = ({ fetchPhotos }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a photo");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    try {
      await API.post("/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // ✅ ensures cookie (JWT) is sent
      });

      alert("✅ Photo uploaded successfully!");
      setTitle("");
      setFile(null);
      fetchPhotos();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <form className="upload-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />

      <button type="submit">Upload Photo</button>
    </form>
  );
};

export default UploadForm;
