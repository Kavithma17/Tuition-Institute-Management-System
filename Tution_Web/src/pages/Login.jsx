import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:8088/auth/login", formData);

      // JWT token returned from backend
      const token = response.data;
      console.log("JWT token:", token);

      // Store JWT token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", formData.username);

      setMessage("Login successful!");
      navigate("/student_dash"); // Redirect to dashboard after login
    } catch (error) {
      if (error.response) {
        setMessage("Login failed: " + error.response.data);
      } else {
        setMessage("Login failed: " + error.message);
      }
    }
  };

  return (
    <div className="loginpage">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Log In</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={() => navigate("/signup")}>Go to Signup</button>
    </div>
  );
};

export default Login;
