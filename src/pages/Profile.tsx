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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

// 1. Define types for the feedback status
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

  // 2. Explicitly type the form states
  const [editData, setEditData] = useState({
    email: user?.email || "",
    bio: (user as any)?.bio || "", // Using cast if bio isn't in base User interface yet
    qualification: (user as any)?.qualification || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState<StatusState>({ type: "", msg: "" });

  useEffect(() => {
    setEditData({
      email: user?.email || "",
      bio: (user as any)?.bio || "",
      qualification: (user as any)?.qualification || "",
    });
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put("/update-profile", editData);

      // Refreshing the local state in Context
      const updatedUser: UserType = { ...user!, ...editData };
      login(updatedUser);

      setStatus({ type: "success", msg: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to update profile." });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus({ type: "error", msg: "New passwords do not match!" });
      return;
    }
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
      const axiosError = err as AxiosError<string>;
      setStatus({
        type: "error",
        msg: axiosError.response?.data || "Failed to change password",
      });
    }
  };

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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white">
                <User size={44} className="text-blue-600" />
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
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
            <div className="flex justify-between items-start mb-10">
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
                className={`mb-6 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                  type="submit"
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> SAVE CHANGES
                </button>
              )}
            </form>

            {/* Password Section */}
            <div className="pt-4 space-y-4">
              {!isEditing && (
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full flex items-center justify-between p-5 rounded-3xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-600 group-hover:text-white text-gray-500">
                      <Key size={20} />
                    </div>
                    <span className="font-black text-gray-700 group-hover:text-blue-700 text-sm uppercase tracking-wider">
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
                <div className="p-8 rounded-[32px] border border-blue-100 bg-white shadow-2xl animate-in slide-in-from-top-4">
                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <input
                      type="password"
                      placeholder="Current Password"
                      required
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl"
                      />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl">
                      UPDATE PASSWORD
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
