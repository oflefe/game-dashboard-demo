import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import "../styles/globals.css";

interface Metric {
  id: number;
  game_name: string;
  downloads: number;
  dau: number;
  mau: number;
  arpu: number;
  arppu: number;
  retention_day1: number;
  retention_day7: number;
  retention_day30: number;
  revenue: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    window.location.href = "/"; // Redirect to login page
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get<Metric[]>("/metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to fetch metrics");
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Metrics Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <table>
        <thead>
          <tr>
            <th>Game Name</th>
            <th>Downloads</th>
            <th>DAU</th>
            <th>MAU</th>
            <th>ARPU</th>
            <th>ARPPU</th>
            <th>Retention Day 1</th>
            <th>Retention Day 7</th>
            <th>Retention Day 30</th>
            <th>Revenue</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.id}>
              <td>{metric.game_name}</td>
              <td>{metric.downloads}</td>
              <td>{metric.dau}</td>
              <td>{metric.mau}</td>
              <td>{metric.arpu.toFixed(2)}</td>
              <td>{metric.arppu.toFixed(2)}</td>
              <td>{metric.retention_day1.toFixed(1)}%</td>
              <td>{metric.retention_day7.toFixed(1)}%</td>
              <td>{metric.retention_day30.toFixed(1)}%</td>
              <td>${metric.revenue.toFixed(2)}</td>
              <td>{metric.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
