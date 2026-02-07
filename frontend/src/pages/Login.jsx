import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

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

  // Submit login request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check admin login first
    if (formData.username === "admin" && formData.password === "abs") {
      setMessage("Admin login successful!");
      navigate("/admin"); // Redirect to admin page
      return;
    }

    // Normal user login via backend
    try {
      const response = await fetch("http://localhost:8088/api/auth/login", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
if (response.ok) {
  const data = await response.json();
  

  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);

  navigate("/dashboard");
}

      else {
        const errorText = await response.text();
        setMessage("Login failed: " + errorText);
      }
    } catch (error) {
      setMessage("Login failed: " + error.message);
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
