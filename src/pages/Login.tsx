import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext, type User } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// Login component for user authentication
const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Access the AuthContext to use the login function and user state
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { login } = authContext;

  // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Typing the response data as our User interface
      const response = await api.post<User>("/login", formData);
      if (response.data && response.data.role) {
        login(response.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Login error details:", axiosError);

      if (axiosError.response) {
        const status = axiosError.response.status;
        if (status === 401 || status === 403 || status === 500) {
          setError("Invalid username or password. Please try again.");
        } else if (status >= 500) {
          setError("The server is having trouble. Please try again later.");
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } else if (axiosError.code === "ERR_NETWORK") {
        setError("Connection lost. Please refresh the page and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for username and password fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')`,
      }}
    >
      <div className="absolute inset-0 bg-black/25"></div>

      <div className="relative z-10 w-full max-w-[450px] bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 border border-white/40 mx-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm mb-2 overflow-hidden border border-gray-100">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/150?text=ELP";
              }}
            />
          </div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            Learning Portal
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Please enter your details to sign in.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
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
              "https://e-learning-platform-backend-production.up.railway.app/oauth2/authorization/google")
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
