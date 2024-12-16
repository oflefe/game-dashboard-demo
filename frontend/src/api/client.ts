import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://game-dashboard-demo.onrender.com/api", // Update this to match your backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
