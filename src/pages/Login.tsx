import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext, type User } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import AuthLayout from "../components/layouts/AuthLayout";
import loginImage from "../src/images/loginpage.webp";

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

        <button
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => window.location.href = "http://localhost:9090/oauth2/authorization/google"}
          className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-teal-200 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>

        <p className="text-center text-sm font-medium text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 font-bold hover:underline">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
