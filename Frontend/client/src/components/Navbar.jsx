import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/profile");
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
    await API.post("/users/logout");
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>📸 Photo Share</div>

      <div className="navbar-right">
        <Link to="/" className="nav-link">Home</Link>

        {user ? (
          <>
            <Link to="/upload" className="nav-link">⬆️ Upload</Link>
            <Link to="/profile" className="nav-link">👤 {user.name}</Link>
            <button className="logout-btn" onClick={logoutHandler}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
