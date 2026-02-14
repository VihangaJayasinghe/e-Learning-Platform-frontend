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

// Export the user-centric API as default (keeping existing behavior)
export default api;

// 3. Define the Classes API instance
export const classApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:9090/api/classes",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 4. Service functions
export const fetchClassesByInstructor = async (username: string) => {
  const response = await classApi.get(`/instructor/${username}`);
  return response.data;
};

export const createClass = async (classData: any) => {
  const response = await classApi.post("", classData);
  return response.data;
};

export const getClassById = async (id: string) => {
  const response = await classApi.get(`/${id}`);
  return response.data;
};
