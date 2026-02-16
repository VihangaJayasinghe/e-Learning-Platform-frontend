import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
  ShieldCheck,
  ShieldAlert,
  X,
} from "lucide-react";

// Define a type for user roles to ensure only valid roles are used
type UserRole = "student" | "teacher";

// Define the shape of the registration form data
interface RegistrationData {
  username: string;
  first_name: string;
  last_name: string;
  password: "";
  confirmPassword: "";
  email: string;
  nic?: string;
  qualification?: string;
  yearsOfExperience?: string;
  subjectExpertise?: string;
  bio?: string;
  mobile_number?: string;
}

// Registration component for new user sign-up
const Register: React.FC = () => {
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  // State to hold form data with initial empty values
  const [formData, setFormData] = useState<RegistrationData>({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    email: "",
    nic: "",
    qualification: "",
    yearsOfExperience: "",
    subjectExpertise: "",
    bio: "",
    mobile_number: "",
  });

  // State to track password requirements for live validation feedback
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Effect to validate password requirements whenever the password field changes
  useEffect(() => {
    const pass = formData.password;
    setRequirements({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[@$!%*?&]/.test(pass),
    });
  }, [formData.password]);

  // Live Validation States
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.password === formData.confirmPassword;
  const isNicValid = formData.nic?.length === 12;
  const isMobileValid = formData.mobile_number?.length === 10;

  // Handle input changes for all form fields, with special handling for numeric fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "nic" || name === "mobile_number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/[^0-9]/g, ""),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission for registration, including validation and API interaction
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Check if all password requirements are met before allowing submission
    const allMet = Object.values(requirements).every(Boolean);
    if (!allMet) {
      setError("Please meet all password requirements.");
      setLoading(false);
      return;
    }

    // Check if passwords match before allowing submission
    if (!passwordsMatch) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Additional validation for teacher role specific fields
    if (role === "teacher") {
      if (!isNicValid) {
        setError("NIC must be exactly 12 digits.");
        setLoading(false);
        return;
      }
      if (!isMobileValid) {
        setError("Mobile number must be exactly 10 digits.");
        setLoading(false);
        return;
      }
    }

    // Determine the appropriate API endpoint based on the selected user role
    const endpoint =
      role === "student" ? "/register/student" : "/register/teacher";

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await api.post(endpoint, dataToSend);
      setSuccess("Account created successfully! Redirecting...");
      setLoading(false);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const backendMessage =
        axiosError.response?.data?.message || axiosError.response?.data;
      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Registration failed.",
      );
      setLoading(false);
    }
  };

  // Component to display individual password requirement with visual feedback
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

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative py-12 px-6 font-sans"
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

        <div className="flex mb-6 bg-white/50 rounded-2xl p-1 border border-gray-100">
          <button
            type="button"
            disabled={loading || !!success}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${role === "student" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500"}`}
            onClick={() => setRole("student")}
          >
            STUDENT
          </button>
          <button
            type="button"
            disabled={loading || !!success}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${role === "teacher" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500"}`}
            onClick={() => setRole("teacher")}
          >
            TEACHER
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50/90 border border-green-200 rounded-2xl flex items-center gap-2 text-green-700 text-xs font-bold animate-in fade-in zoom-in-95 duration-500">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                First Name
              </label>
              <input
                name="first_name"
                required
                disabled={!!success}
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                Last Name
              </label>
              <input
                name="last_name"
                required
                disabled={!!success}
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              disabled={!!success}
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
              Username
            </label>
            <input
              name="username"
              required
              disabled={!!success}
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe123"
              className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                disabled={!!success}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
              />
            </div>
            <div className="space-y-1 relative">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                Confirm
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                disabled={!!success}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
              />
              {formData.confirmPassword && (
                <div
                  className={`absolute right-4 top-9 transition-colors ${passwordsMatch ? "text-green-500" : "text-red-400"}`}
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

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-white/30 p-3 rounded-2xl border border-white/40">
            <Requirement met={requirements.length} text="8+ Characters" />
            <Requirement met={requirements.uppercase} text="Uppercase Letter" />
            <Requirement met={requirements.number} text="Includes Number" />
            <Requirement met={requirements.special} text="Symbol (@$!%*?&)" />
          </div>

          {role === "teacher" && (
            <div className="pt-4 space-y-4 border-t border-white/50 mt-4 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                    NIC
                  </label>
                  <input
                    name="nic"
                    maxLength={12}
                    required={role === "teacher"}
                    disabled={!!success}
                    value={formData.nic}
                    onChange={handleChange}
                    placeholder="e.g. 199512345678"
                    className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none text-sm pr-10"
                  />
                  {formData.nic && (
                    <div
                      className={`absolute right-4 top-9 transition-colors ${isNicValid ? "text-green-500" : "text-red-400"}`}
                    >
                      {isNicValid ? <Check size={18} /> : <X size={18} />}
                    </div>
                  )}
                </div>
                <div className="space-y-1 relative">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                    Mobile
                  </label>
                  <input
                    name="mobile_number"
                    maxLength={10}
                    required={role === "teacher"}
                    disabled={!!success}
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="e.g. 0771234567"
                    className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none text-sm pr-10"
                  />
                  {formData.mobile_number && (
                    <div
                      className={`absolute right-4 top-9 transition-colors ${isMobileValid ? "text-green-500" : "text-red-400"}`}
                    >
                      {isMobileValid ? <Check size={18} /> : <X size={18} />}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                    Qualification
                  </label>
                  <input
                    name="qualification"
                    disabled={!!success}
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. PhD in Computer Science"
                    className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                    Exp (Years)
                  </label>
                  <input
                    name="yearsOfExperience"
                    type="number"
                    disabled={!!success}
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                  Subject Expertise
                </label>
                <input
                  name="subjectExpertise"
                  disabled={!!success}
                  value={formData.subjectExpertise}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Development"
                  className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-2 tracking-widest">
                  Bio
                </label>
                <textarea
                  name="bio"
                  disabled={!!success}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your teaching experience..."
                  className="w-full px-5 py-3 bg-white/50 border border-gray-100 rounded-2xl outline-none resize-none h-20 text-sm font-medium"
                />
              </div>
            </div>
          )}

          <button
            disabled={loading || !!success}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-70"
          >
            {loading ? (
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
