import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8088/users/register",
        formData
      );

      setMessage("Signup successful! Redirecting to login...");
      setFormData({ username: "", email: "", password: "" });

      // Redirect to login after 1 second
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      if (error.response) {
        setMessage("Signup failed: " + error.response.data);
      } else {
        setMessage("Signup failed: " + error.message);
      }
    }
  };

  return (
    <div className="signup">
      <h2>Signup</h2>
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}

      <br />
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
};

export default Signup;
