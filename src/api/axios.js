import axios from "axios";

const api = axios.create({
  baseURL: "https://busticketing-tq3o.onrender.com", // from Swagger "servers"
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
