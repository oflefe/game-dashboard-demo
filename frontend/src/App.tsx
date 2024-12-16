import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChartsView from "./pages/ChartsView";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  return (
    <Router>
      <div className="app">
        {/* Sidebar */}
        {token && (
          <nav className="sidebar">
            <h2>Metrics App</h2>
            <ul>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/charts">Charts</Link>
              </li>
            </ul>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </nav>
        )}

        {/* Main Content */}
        <div className="content">
          <Routes>
            <Route path="/" element={<LoginPage setToken={setToken} />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/charts" element={<ChartsView />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
