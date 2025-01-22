import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";

const MyAccount = () => {
  const { login } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState("CUSTOMER"); // Default role
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      login(response.data, response.data.token);
      setIsLoggedIn(true);
      setFeedback("Login successful!");
      setError(null);
      if (response.data.role) {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid login credentials");
      setFeedback("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/auth/register`, { ...formData, role });
      setSuccess(true);
      setFeedback("Registration successful! Please log in.");
      setIsRegistering(false);

      // Navigate to the appropriate login page after registration
      if (role.toUpperCase() === "CUSTOMER") {
        navigate("/customer/login");
      } else if (role.toUpperCase() === "AGENCY") {
        navigate("/agency/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFeedback("You have been logged out.");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="my-account">
      <div className="loginBg"></div>
      <div>
        
          <div className="auth-container">
            <h2>{isRegistering ? `${role} Register` : "Login"}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && (
              <>
                <div className="role">
                  <label htmlFor="role">Role:</label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="AGENCY">Agency</option>
                  </select>
                  </div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  
                </>
              )}
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
              onChange={handleInputChange}
              placeholder="Minimum of 10 characters long"
                required
              />
              <button type="submit">{isRegistering ? "Register" : "Login"}</button>
            </form>
            <p>
              {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
              <button className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Login" : "Register"}
              </button>
            </p>
            {feedback && <p className="feedback-message">{feedback}</p>}
            {error && <p className="feedback-message error">{error}</p>}
            {success && <p className="feedback-message">Registration successful!</p>}
          </div>
        
      </div>
    </div>
  );
};

export default MyAccount;
