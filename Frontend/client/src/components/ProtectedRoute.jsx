import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    API.get("/users/profile") // ✅ correct now
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <p>Checking authentication...</p>;

  return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
