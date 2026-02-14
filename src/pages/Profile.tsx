import React, { useState, useContext, useEffect } from "react";
import { AuthContext, type User as UserType } from "../context/AuthContext";
import api from "../services/api";
import {
  User,
  Mail,
  Key,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  FileText,
  Edit3,
  Save,
  X,
  Check,
  ShieldCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface StatusState {
  type: "success" | "error" | "";
  msg: string;
}

const Profile: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("Profile must be used within an AuthProvider");
  }

  const { user, login } = auth;
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [editData, setEditData] = useState({
    email: user?.email || "",
    bio: (user as any)?.bio || "",
    qualification: (user as any)?.qualification || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState<StatusState>({ type: "", msg: "" });

  // Live Requirement State
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Track new password requirements live
  useEffect(() => {
    const pass = passwords.newPassword;
    setRequirements({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[@$!%*?&]/.test(pass),
    });
  }, [passwords.newPassword]);

  const passwordsMatch =
    passwords.newPassword.length > 0 &&
    passwords.newPassword === passwords.confirmPassword;

  useEffect(() => {
    setEditData({
      email: user?.email || "",
      bio: (user as any)?.bio || "",
      qualification: (user as any)?.qualification || "",
    });
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/update-profile", editData);
      const updatedUser: UserType = { ...user!, ...editData };
      login(updatedUser);
      setStatus({ type: "success", msg: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allMet = Object.values(requirements).every(Boolean);
    if (!allMet) {
      setStatus({
        type: "error",
        msg: "New password does not meet requirements.",
      });
      return;
    }

    if (!passwordsMatch) {
      setStatus({ type: "error", msg: "New passwords do not match!" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/change-password", passwords);
      setStatus({ type: "success", msg: "Password updated successfully!" });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const backendMsg =
        axiosError.response?.data?.message || axiosError.response?.data;
      setStatus({
        type: "error",
        msg:
          typeof backendMsg === "string"
            ? backendMsg
            : "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-all font-bold text-sm"
        >
          <ArrowLeft size={18} /> BACK TO DASHBOARD
        </button>

        <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white">
                <User size={44} className="text-blue-600" />
              </div>
            </div>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setShowPasswordForm(false);
                setStatus({ type: "", msg: "" });
              }}
              className="absolute bottom-4 right-8 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-white/30"
            >
              {isEditing ? (
                <>
                  <X size={16} /> Cancel
                </>
              ) : (
                <>
                  <Edit3 size={16} /> Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="pt-16 p-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {user?.username}
                </h1>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">
                  {user?.role} ACCOUNT
                </p>
              </div>
            </div>

            {status.msg && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in zoom-in-95 duration-300 ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
              >
                {status.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {status.msg}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                  <Mail size={20} />
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Email Address
                  </p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none font-bold text-gray-700"
                    />
                  ) : (
                    <p className="text-gray-700 font-bold">
                      {user?.email || "No email linked"}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                  <FileText size={20} />
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    About Me
                  </p>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none font-medium text-gray-600 mt-1 h-20 resize-none"
                    />
                  ) : (
                    <p className="text-gray-600 text-sm mt-1">
                      {(user as any)?.bio || "Tell us about yourself..."}
                    </p>
                  )}
                </div>
              </div>

              {user?.role === "TEACHER" && (
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Qualification
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.qualification}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            qualification: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none font-bold text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-700 font-bold">
                        {(user as any)?.qualification || "Add qualification"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {isEditing && (
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} /> SAVE CHANGES
                    </>
                  )}
                </button>
              )}
            </form>

            {/* Security Section */}
            <div className="pt-4 space-y-4">
              {!isEditing && (
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setStatus({ type: "", msg: "" });
                  }}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 border-dashed transition-all group ${showPasswordForm ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-xl transition-colors ${showPasswordForm ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-blue-600 group-hover:text-white"}`}
                    >
                      <Key size={20} />
                    </div>
                    <span
                      className={`font-black text-sm uppercase tracking-wider ${showPasswordForm ? "text-blue-700" : "text-gray-700 group-hover:text-blue-700"}`}
                    >
                      Security Settings
                    </span>
                  </div>
                  {showPasswordForm ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              )}

              {showPasswordForm && !isEditing && (
                <div className="p-8 rounded-[32px] border border-blue-100 bg-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                        Current Password
                      </p>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                          New Password
                        </p>
                        <input
                          type="password"
                          placeholder="••••••••"
                          required
                          value={passwords.newPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1 relative">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                          Confirm New
                        </p>
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
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {passwords.confirmPassword && (
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

                    {/* Live Requirements Tracker */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <Requirement
                        met={requirements.length}
                        text="8+ Characters"
                      />
                      <Requirement
                        met={requirements.uppercase}
                        text="Uppercase Letter"
                      />
                      <Requirement
                        met={requirements.number}
                        text="Includes Number"
                      />
                      <Requirement
                        met={requirements.special}
                        text="Symbol (@$!%*?&)"
                      />
                    </div>

                    <button
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "UPDATE PASSWORD"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
