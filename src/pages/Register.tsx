import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type UserRole = "student" | "teacher";

interface RegistrationData {
  username: string;
  password: "";
  email: string;
  qualification?: string;
  yearsOfExperience?: string;
  subjectExpertise?: string;
  bio?: string;
}

const Register: React.FC = () => {
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>(""); // New success state
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationData>({
    username: "",
    password: "",
    email: "",
    qualification: "",
    yearsOfExperience: "",
    subjectExpertise: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint =
      role === "student" ? "/register/student" : "/register/teacher";

    try {
      await api.post(endpoint, formData);

      // 1. Show success message
      setSuccess("Account created successfully! Redirecting to login...");

      // 2. Wait 3 seconds before navigating
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const axiosError = err as AxiosError<any>;

      if (axiosError.response) {
        const backendMessage = axiosError.response.data;

        if (axiosError.response.status === 409) {
          setError(
            typeof backendMessage === "string"
              ? backendMessage
              : "This email is already registered.",
          );
        } else if (typeof backendMessage === "string") {
          setError(backendMessage);
        } else if (backendMessage?.message) {
          setError(backendMessage.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      setLoading(false); // Only stop loading on error, so button stays in 'loading' or success state
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative p-6 font-sans"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 border border-white/40">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Join the ELP learning community
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex mb-8 bg-white/50 rounded-2xl p-1 border border-gray-100">
          <button
            type="button"
            disabled={loading || !!success}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              role === "student"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-500 hover:text-gray-700"
            } disabled:opacity-50`}
            onClick={() => setRole("student")}
          >
            STUDENT
          </button>
          <button
            type="button"
            disabled={loading || !!success}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              role === "teacher"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-500 hover:text-gray-700"
            } disabled:opacity-50`}
            onClick={() => setRole("teacher")}
          >
            TEACHER
          </button>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50/90 border border-green-200 rounded-2xl flex items-center gap-2 text-green-700 text-xs font-bold animate-in fade-in zoom-in-95 duration-500">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                Email
              </label>
              <input
                name="email"
                type="email"
                disabled={loading || !!success}
                value={formData.email}
                placeholder="email@example.com"
                required
                onChange={handleChange}
                className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                Username
              </label>
              <input
                name="username"
                type="text"
                disabled={loading || !!success}
                value={formData.username}
                placeholder="username"
                required
                onChange={handleChange}
                className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                Password
              </label>
              <input
                name="password"
                type="password"
                disabled={loading || !!success}
                value={formData.password}
                placeholder="••••••••"
                required
                onChange={handleChange}
                className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium disabled:opacity-50"
              />
            </div>
          </div>

          {role === "teacher" && (
            <div className="pt-4 space-y-4 border-t border-white/50 mt-4 animate-in fade-in duration-500 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                    Degree
                  </label>
                  <input
                    name="qualification"
                    disabled={loading || !!success}
                    value={formData.qualification}
                    placeholder="PhD, MSc"
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl text-sm outline-none font-medium disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                    Experience
                  </label>
                  <input
                    name="yearsOfExperience"
                    type="number"
                    disabled={loading || !!success}
                    value={formData.yearsOfExperience}
                    placeholder="Years"
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl text-sm outline-none font-medium disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            disabled={loading || !!success}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading || !!success ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              `REGISTER AS ${role.toUpperCase()}`
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6 font-medium">
          Already a member?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-black hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
