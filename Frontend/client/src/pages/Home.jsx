import React, { useState, useEffect } from "react";
import API from "../api";
import UploadForm from "../components/UploadForm";
import PhotoList from "../components/photoList";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // 🔍 NEW state
  const photosPerPage = 5;
  const navigate = useNavigate();

  // ✅ 1️⃣ Check Authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/users/profile", { withCredentials: true });
        setUser(data.user);
      } catch (error) {
        console.warn("Not authenticated, redirecting to login...");
        setUser(null);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // ✅ 2️⃣ Fetch Photos
  const fetchPhotos = async () => {
    try {
      const { data } = await API.get(`/photos?search=${search}`, { withCredentials: true }); // 🔍 added query param
      setPhotos(data);
      // setCurrentPage(1);  reset to first page on new search
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    if (user) fetchPhotos();
  }, [user, search]); // 🔍 re-fetch when search changes

  // ✅ 3️⃣ Pagination
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

  // ✅ 4️⃣ Render
  if (loading) return <p>Loading...</p>;

  return (
    <div className="upload-heading">

      {/* 🔍 Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search images by title or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ✅ Photo list */}
      <PhotoList photos={currentPhotos} fetchPhotos={fetchPhotos} user={user} />

      {/* ✅ Pagination */}
      {photos.length > 0 && (
        <div className="pagination-container">
          <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn">
            ⬅ Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}

          <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-btn">
            ➡ Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
