import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import "../styles/globals.css";

interface LoginPageProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token); // Store the token
      setToken(response.data.token);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/register", { username, password });
      alert("Registration successful! You can now log in.");
      setIsRegistering(false); // Switch back to login
    } catch (error) {
      console.error("Registration failed", error);
      alert("Failed to register. Try a different username.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <h1>{isRegistering ? "Register" : "Login"}</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        <p>
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <span
                className="toggle-link"
                onClick={() => setIsRegistering(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="toggle-link"
                onClick={() => setIsRegistering(true)}
              >
                Register
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
