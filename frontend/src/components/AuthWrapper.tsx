import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthWrapper: React.FC = () => {
  const token = localStorage.getItem("token"); // Check for token

  if (token) {
    return <Navigate to="/dashboard" />; // Redirect logged-in users to dashboard
  }

  return <Outlet />; // Render child routes (e.g., login/register)
};

export default AuthWrapper;
