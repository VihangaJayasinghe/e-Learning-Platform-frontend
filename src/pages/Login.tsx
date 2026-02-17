import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext, type User } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import AuthLayout from "../components/layouts/AuthLayout";
import loginImage from "../src/images/loginpage.webp";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext must be used within an AuthProvider");
  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post<User>("/login", formData);
      if (response.data && response.data.role) login(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        setError("Invalid credentials. Please try again.");
      } else if (axiosError.code === "ERR_NETWORK") {
        setError("Network error. Check your connection.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AuthLayout
      imageSrc={loginImage}
      title="Welcome back"
      subtitle="Please enter your details to sign in."
      reverse={false}
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Username or Email</label>
          <input
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all font-medium"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer" />
            <span className="text-sm font-medium text-gray-500 group-hover:text-teal-700 transition-colors">Remember for 30 days</span>
          </label>
          <Link to="/forgot-password" className="text-sm font-bold text-teal-600 hover:text-teal-700">
            Forgot password
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
              Username
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="username"
                type="text"
                placeholder="your_username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3.5 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 font-bold group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-6">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black tracking-widest uppercase">
              Social Login
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={() =>
            (window.location.href =
              "http://localhost:9090/oauth2/authorization/google")
            }
            className="w-full bg-white/80 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-white hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="text-gray-500 text-sm font-medium">
            New to ELP?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-black hover:underline underline-offset-4"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
