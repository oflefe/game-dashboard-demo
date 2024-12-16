import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("token"); // Check for token

  if (!token) {
    return <Navigate to="/" />; // Redirect non-logged-in users to login
  }

  return <Outlet />; // Render child routes (e.g., dashboard)
};

export default ProtectedRoute;
