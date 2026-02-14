import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AxiosError } from "axios";
import {
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Check,
} from "lucide-react";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Live Requirement State
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Track password policy requirements live
  useEffect(() => {
    const pass = passwords.newPassword;
    setRequirements({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[@$!%*?&]/.test(pass),
    });
  }, [passwords.newPassword]);

  // Live match check
  const passwordsMatch =
    passwords.newPassword.length > 0 &&
    passwords.newPassword === passwords.confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Final security checks
    const allMet = Object.values(requirements).every(Boolean);
    if (!allMet) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password", {
        token: token,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const backendMessage =
        axiosError.response?.data?.message || axiosError.response?.data;
      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Invalid or expired token. Please request a new link.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Reusable Requirement UI
  const Requirement = ({ met, text }: { met: boolean; text: string }) => (
    <div
      className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors ${met ? "text-green-600" : "text-gray-400"}`}
    >
      {met ? (
        <Check size={12} strokeWidth={3} />
      ) : (
        <div className="w-3 h-3 border-2 border-gray-200 rounded-full" />
      )}
      {text}
    </div>
  );

  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white max-w-sm w-full text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Invalid Link
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            No security token was found in your URL.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative py-12 px-6 font-sans"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')`,
      }}
    >
      <div className="absolute inset-0 bg-black/25"></div>

      <div className="relative z-10 w-full max-w-[450px] bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 border border-white/40">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm mb-4 mx-auto border border-gray-100">
            <ShieldCheck className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Set New Password
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Please choose a strong password for your account.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50/80 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700 font-bold text-xs animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
              {passwords.confirmPassword && (
                <div
                  className={`absolute right-4 top-3.5 transition-colors ${passwordsMatch ? "text-green-500" : "text-red-400"}`}
                >
                  {passwordsMatch ? (
                    <ShieldCheck size={18} />
                  ) : (
                    <ShieldAlert size={18} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Live Requirement Grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-white/30 p-3 rounded-2xl border border-white/40">
            <Requirement met={requirements.length} text="8+ Characters" />
            <Requirement met={requirements.uppercase} text="Uppercase Letter" />
            <Requirement met={requirements.number} text="Includes Number" />
            <Requirement met={requirements.special} text="Symbol (@$!%*?&)" />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "UPDATE PASSWORD"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} /> BACK TO LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
