import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8088", // Your backend base URL
});

// Add a request interceptor to include the JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
