import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/globals.css";

interface Metric {
  id: number;
  game_name: string;
  date: string;
  dau: number;
  revenue: number;
  retention_day7: number;
  retention_day30: number;
}

const availableMetrics = [
  { key: "dau", label: "Daily Active Users (DAU)" },
  { key: "revenue", label: "Revenue" },
  { key: "retention_day7", label: "Retention Day 7" },
  { key: "retention_day30", label: "Retention Day 30" },
];

const ChartsView: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

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

  const filteredMetrics = metrics.filter(
    (metric) => metric.game_name === selectedGame
  );

  const handleMetricSelection = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  return (
    <div className="container">
      <h1>Charts View</h1>

      {/* Dropdown to select game */}
      <div className="filters">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">Select a game</option>
          {Array.from(new Set(metrics.map((metric) => metric.game_name))).map(
            (game) => (
              <option key={game} value={game}>
                {game}
              </option>
            )
          )}
        </select>
      </div>

      {/* Metric Selector */}
      <div className="metric-selector">
        <h3>Select Metrics to View:</h3>
        {availableMetrics.map((metric) => (
          <label key={metric.key}>
            <input
              type="checkbox"
              value={metric.key}
              checked={selectedMetrics.includes(metric.key)}
              onChange={() => handleMetricSelection(metric.key)}
            />
            {metric.label}
          </label>
        ))}
      </div>

      {/* Chart */}
      {filteredMetrics.length > 0 && selectedMetrics.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={filteredMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedMetrics.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke="#8884d8"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>
          {selectedGame
            ? "Select at least one metric to view the chart."
            : "Select a game to start."}
        </p>
      )}
    </div>
  );
};

export default ChartsView;
