import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader2, Check, User, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "../components/layouts/AuthLayout";
import studentImage from "../src/images/signinpage.webp";
import teacherImage from "../src/images/teachersigninpage.webp";

type UserRole = "student" | "teacher";

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

const Register: React.FC = () => {
  const [role, setRole] = useState<UserRole>("student");
  const [step, setStep] = useState<number>(1); // For Teacher 2-step process
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

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

  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const pass = formData.password;
    setRequirements({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[@$!%*?&]/.test(pass),
    });
  }, [formData.password]);

  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "nic" || name === "mobile_number") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = () => {
    // Basic validation for Step 1
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (!Object.values(requirements).every(Boolean)) {
      setError("Password does not meet requirements.");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (role === "student" && !passwordsMatch) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const endpoint = role === "student" ? "/register/student" : "/register/teacher";

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await api.post(endpoint, dataToSend);
      setSuccess("Account created successfully!");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const backendMessage = axiosError.response?.data?.message || axiosError.response?.data;
      setError(typeof backendMessage === "string" ? backendMessage : "Registration failed.");
      setLoading(false);
    }
  };

  const Requirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${met ? "text-teal-600" : "text-gray-300"}`}>
      <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${met ? "bg-teal-600 border-teal-600" : "border-gray-200"}`}>
        {met && <Check size={8} className="text-white" strokeWidth={4} />}
      </div>
      {text}
    </div>
  );

  return (
    <div className="animate-in slide-in-from-right duration-500 ease-out">
      <AuthLayout
        imageSrc={role === "student" ? studentImage : teacherImage}
        title={`Join as a ${role === "student" ? "Student" : "Teacher"}`}
        subtitle={step === 2 && role === "teacher" ? "Professional Details" : "Create your account today."}
        reverse={true} // Image Left, Form Right
      >
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8 max-w-sm">
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === "student" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            onClick={() => { setRole("student"); setStep(1); }}
          >
            <User size={16} strokeWidth={2.5} /> Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === "teacher" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            onClick={() => setRole("teacher")}
          >
            <GraduationCap size={16} strokeWidth={2.5} /> Teacher
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 animate-in fade-in zoom-in-95">{error}</div>}
        {success && <div className="mb-6 p-4 bg-teal-50 text-teal-700 text-sm font-bold rounded-xl border border-teal-100 animate-in fade-in zoom-in-95">{success}</div>}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5 max-w-lg">

          {/* Step 1: Account Details (Always shown for Student, Step 1 for Teacher) */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="First Name" name="first_name" placeholder="John" value={formData.first_name} onChange={handleChange} />
                <InputGroup label="Last Name" name="last_name" placeholder="Doe" value={formData.last_name} onChange={handleChange} />
              </div>

              <InputGroup label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              <InputGroup label="Username" name="username" placeholder="johndoe" value={formData.username} onChange={handleChange} />

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <InputGroup label="Confirm" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-y-2 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                <Requirement met={requirements.length} text="8+ Characters" />
                <Requirement met={requirements.uppercase} text="Uppercase Letter" />
                <Requirement met={requirements.number} text="Number" />
                <Requirement met={requirements.special} text="Special Character" />
              </div>
            </div>
          )}

          {/* Step 2: Teacher Professional Details */}
          {step === 2 && role === "teacher" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="NIC" name="nic" maxLength={12} placeholder="Identity Number" value={formData.nic} onChange={handleChange} />
                <InputGroup label="Mobile" name="mobile_number" maxLength={10} placeholder="Mobile Number" value={formData.mobile_number} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Qualification" name="qualification" placeholder="Degree/Diploma" value={formData.qualification} onChange={handleChange} />
                <InputGroup label="Exp (Years)" name="yearsOfExperience" type="number" placeholder="Years" value={formData.yearsOfExperience} onChange={handleChange} />
              </div>
              <InputGroup label="Subject Expertise" name="subjectExpertise" placeholder="e.g. Mathematics" value={formData.subjectExpertise} onChange={handleChange} />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none h-24 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            {role === "teacher" && step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Next Step <ArrowRight size={20} strokeWidth={3} />
              </button>
            ) : (
              <div className="flex gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} strokeWidth={3} /> Back
                  </button>
                )}
                <button
                  type="button" // Trigger submit via form handler or check validation first
                  onClick={(e) => handleSubmit(e as any)}
                  disabled={loading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                </button>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-sm font-medium text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in</Link>
          </p>
        </form>
      </AuthLayout>
    </div>
  );
};

const InputGroup = ({ label, ...props }: any) => (
  <div className="w-full">
    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wide">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder-gray-300"
    />
  </div>
);

export default Register;
