import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // 👈 NEW state for toggle

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/profile", { withCredentials: true });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener("userLoggedIn", fetchUser);
    return () => window.removeEventListener("userLoggedIn", fetchUser);
  }, []);

  const logoutHandler = async () => {
    await API.post("/users/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        📸 Photo Share
      </div>

      {/* Hamburger Icon (mobile) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </div>

      {/* Nav Links */}
      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        {user ? (
          <>
            <Link to="/upload" className="nav-link" onClick={() => setMenuOpen(false)}>
              ⬆️ Upload
            </Link>
            <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
              👤 {user.name}
            </Link>
            <button
              className="logout-btn"
              onClick={() => {
                logoutHandler();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
