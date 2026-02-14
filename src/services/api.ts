import axios, { type AxiosInstance } from "axios";

// 1. Define the base API instance with a Type
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:9090/api/users",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 2. We will add Response Interfaces here later
// Example: export interface UserResponse { id: string; email: string; ... }

export default api;
