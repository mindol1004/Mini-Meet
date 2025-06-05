import axios from "axios";

// Create axios instance with base URL
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add auth token to requests if available
if (typeof window !== "undefined") {
  const token = localStorage.getItem("accessToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}