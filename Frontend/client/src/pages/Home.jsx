import React, { useState, useEffect } from "react";
import API from "../api"; // must have withCredentials: true in config
import UploadForm from "../components/UploadForm";
import PhotoList from "../components/photoList";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 to prevent flicker before redirect
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 5;
  const navigate = useNavigate();

  // ✅ 1️⃣ Check Authentication on Mount
useEffect(() => {
  const checkAuth = async () => {
    try {
      const { data } = await API.get("/users/profile", { withCredentials: true });
      setUser(data.user);
    } catch (error) {
      console.warn("Not authenticated, redirecting to login...");
      setUser(null); // clear state
      navigate("/login", { replace: true });
    } finally {
      setLoading(false); // ensure loading ends
    }
  };
  checkAuth();
}, [navigate]);
  // ✅ 2️⃣ Fetch Photos
  const fetchPhotos = async () => {
    try {
      const { data } = await API.get("/photos", { withCredentials: true });
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    if (user) fetchPhotos(); // 👈 fetch photos only when user is authenticated
  }, [user]);

  // ✅ 3️⃣ Pagination Logic
  const totalPages = Math.ceil(photos.length / photosPerPage);
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // ✅ 4️⃣ Render Logic
  if (loading) return <p>Loading...</p>; // 👈 prevents flash before redirect

  return (
    <div className="upload-heading">
      
      <PhotoList photos={currentPhotos} fetchPhotos={fetchPhotos} user={user} />

      {photos.length > 0 && (
        <div className="pagination-container">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ⬅ Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`page-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            ➡ Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
