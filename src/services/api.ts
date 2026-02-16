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

// 5. Define the Admin API instance
export const adminApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:9090/api/admins",
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

export const updateClass = async (id: string, classData: any) => {
  const response = await classApi.put(`/${id}`, classData);
  return response.data;
};

export const updateClassStatus = async (id: string, status: string) => {
  const response = await classApi.patch(`/${id}/status?status=${status}`);
  return response.data;
};

export const extendClassDuration = async (id: string, additionalMonths: number) => {
  const response = await classApi.patch(`/${id}/extend?additionalMonths=${additionalMonths}`);
  return response.data;
};

export const deleteClass = async (id: string, key: string) => {
  await classApi.delete(`/${id}/${key}`);
};

export interface SystemStats {
  totalCourses: number;
  totalVideos: number;
  totalInstructors: number;
  totalStudents: number;
}

export const getSystemStats = async (): Promise<SystemStats> => {
  const response = await adminApi.get("/stats");
  return response.data;
};

export interface Course {
  id: string;
  courseTitle: string;
  description: string;
  subject: string;
  topic: string;
  level: string;
  instructorId: string;
  instructorName: string;
  videoIds: string[];
  documentIds: string[];
  quizIds: string[];
  estimatedHours: number;
  totalLessons: number;
  averageRating: number;
  totalReviews: number;
  price: number;
  isFree: boolean;
  tags: string[];
  thumbnailUrl: string; // Corrected from previewVideoUrl to match user JSON if needed, but user JSON has both. Keeping consistent with user JSON.
  previewVideoUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
  publishedAt: string;
}

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await adminApi.get("/courses");
  return response.data;
};

export const deleteCourse = async (id: string, key: string) => {
  await adminApi.delete(`/courses/${id}/${key}`);
};

export interface ClassMonth {
  yearMonth: string;
  displayName: string;
  videoIds: string[];
  quizIds: string[];
  documentIds: string[];
  releaseDate: string | null;
  released: boolean;
}

export interface Class {
  id: string;
  className: string;
  description: string;
  teacher: any;
  monthlyPrice: number;
  startMonth: string;
  durationMonths: number;
  months: ClassMonth[];
  createdDate: string;
  status: string;
  averageRating: number;
  totalReviews: number;
  instructorName: string;
  endMonth: string;
}

export const getAllClasses = async (): Promise<Class[]> => {
  const response = await adminApi.get("/classes");
  return response.data;
};

export const getClassDetails = async (id: string): Promise<Class> => {
  const response = await adminApi.get(`/classes/${id}`);
  return response.data;
};



