import React, { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const ForgotPassword: React.FC = () => {
  // 1. State management for form input, messages, and loading state
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 2. Handle form submission for password recovery
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Sending an object with the email to your backend endpoint
      await api.post("/forgot-password", { email });
      setMessage("Recovery link sent! Please check your inbox.");
    } catch (err) {
      // Safely casting the error to AxiosError to read specific messages
      const axiosError = err as AxiosError<string>;
      setError(
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : "Request failed. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-teal-100 to-teal-600 relative font-sans">
      {/* Background overlay removed */}

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 border border-white/40 shadow-teal-900/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-teal-900">Reset Access</h1>
          <p className="text-teal-700 text-sm mt-1 font-medium">
            We will send you a recovery link
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50/80 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700 font-bold text-xs">
            <CheckCircle size={18} /> {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black uppercase text-teal-800 ml-2 tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-teal-500"
                size={18}
              />
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                // 3. Typing the Change Event for the input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-teal-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-teal-900 placeholder-teal-300"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "SEND RECOVERY LINK"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-black text-teal-600 hover:underline"
          >
            <ArrowLeft size={16} /> BACK TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
