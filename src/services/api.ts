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

export const enrollmentApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:9090/api/enrollments",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 4. Service functions
// --- Class Service ---
export const getAllClasses = async () => {
  const response = await classApi.get("");
  return response.data;
};

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

export const deleteClass = async (id: string) => {
  await classApi.delete(`/${id}`);
};

export const addVideoToMonth = async (classId: string, yearMonth: string, videoId: string) => {
  const response = await classApi.post(`/${classId}/months/${yearMonth}/videos/${videoId}`);
  return response.data;
};

export const removeVideoFromMonth = async (classId: string, yearMonth: string, videoId: string) => {
  const response = await classApi.delete(`/${classId}/months/${yearMonth}/videos/${videoId}`);
  return response.data;
};

export const getMonthVideos = async (classId: string, yearMonth: string) => {
  const response = await classApi.get(`/${classId}/months/${yearMonth}/videos`);
  return response.data;
};

export const getMonthDocuments = async (classId: string, yearMonth: string) => {
  const response = await classApi.get(`/${classId}/months/${yearMonth}/documents`);
  return response.data;
};

// --- Enrollment Service ---
export const enrollStudent = async (classId: string) => {
  const response = await enrollmentApi.post(`/enroll/${classId}`);
  return response.data;
};

export const getStudentEnrollments = async () => {
  const response = await enrollmentApi.get("/my-enrollments");
  return response.data;
};

export const checkEnrollment = async (classId: string) => {
  const response = await enrollmentApi.get(`/check/${classId}`);
  return response.data;
};

// --- Video API ---
export const videoApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:9090/api/videos",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getVideoById = async (id: string) => {
  const response = await videoApi.get(`/${id}`);
  return response.data;
};

export const uploadVideo = async (formData: FormData) => {
  const response = await videoApi.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteVideo = async (id: string) => {
  await videoApi.delete(`/${id}`);
};

// Document API
export const documentApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:9090/api/documents", // Check controller path
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getDocumentById = async (id: string) => {
  const response = await documentApi.get(`/${id}`);
  return response.data;
};

export const uploadDocument = async (formData: FormData) => {
  const response = await documentApi.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteDocument = async (id: string) => {
  await documentApi.delete(`/${id}`);
};

export const addDocumentToMonth = async (classId: string, yearMonth: string, documentId: string) => {
  const response = await classApi.post(`/${classId}/months/${yearMonth}/documents/${documentId}`);
  return response.data;
};

export const removeDocumentFromMonth = async (classId: string, yearMonth: string, documentId: string) => {
  const response = await classApi.delete(`/${classId}/months/${yearMonth}/documents/${documentId}`);
  return response.data;
};

// Quiz API
export const quizApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:9090/api/quizzes",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getQuizzesByClassAndMonth = async (classId: string, monthId: string) => {
  const response = await quizApi.get(`/class/${classId}/month/${monthId}`);
  return response.data;
};

export const createQuiz = async (quizData: any) => {
  const response = await quizApi.post("", quizData);
  return response.data;
};

export const deleteQuiz = async (id: string) => {
  await quizApi.delete(`/${id}`);
};

export const getQuizById = async (id: string) => {
  const response = await quizApi.get(`/${id}`);
  return response.data;
};

// Question API
export const addQuestionToQuiz = async (quizId: string, questionData: any) => {
  const response = await quizApi.post(`/${quizId}/add-question`, questionData);
  return response.data;
};

export const updateQuestionInQuiz = async (quizId: string, questionId: string, questionData: any) => {
  const response = await quizApi.put(`/${quizId}/update-question/${questionId}`, questionData);
  return response.data;
};

export const deleteQuestionFromQuiz = async (quizId: string, questionId: string) => {
  const response = await quizApi.delete(`/${quizId}/delete-question/${questionId}`);
  return response.data;
};

// Quiz Results API
export const getQuizResults = async (quizId: string) => {
  const response = await quizApi.get(`/quiz/${quizId}/results`);
  return response.data;
};

export const getQuizStatistics = async (quizId: string) => {
  const response = await quizApi.get(`/quiz/${quizId}/statistics`);
  return response.data;
};
