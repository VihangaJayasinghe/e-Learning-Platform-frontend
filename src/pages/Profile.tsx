import React, { useState, useContext, useEffect } from "react";
import { AuthContext, type User as UserType } from "../context/AuthContext";
import api, { fetchClassesByInstructor, getStudentEnrollments } from "../services/api";
import ClassCard from "../components/ClassCard";
import {
  User,
  Mail,
  Key,
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
  Star,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface StatusState {
  type: "success" | "error" | "";
  msg: string;
}

interface Class {
  id: string;
  className: string;
  description: string;
  instructorUsername: string;
  schedule: string;
  duration: string;
  monthlyPrice: number;
  status: string;
  teacher?: { username: string }; // For student enrollments
}

const Profile: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("Profile must be used within an AuthProvider");
  }

  const { user, login } = auth;
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

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

  // Fetch Classes based on Role
  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;
      try {
        setClassesLoading(true);
        if (user.role === 'TEACHER') {
          const data = await fetchClassesByInstructor(user.username);
          // Filter active classes (or show all since it's their profile? let's show all for them)
          setClasses(Array.isArray(data) ? data : []);
        } else if (user.role === 'STUDENT') {
          const data = await getStudentEnrollments();
          if (Array.isArray(data)) {
            // Transform enrollments to classes
            const enrolledClasses = data.map((enrollment: any) => enrollment.classEnrolled).filter(Boolean);
            setClasses(enrolledClasses);
          }
        }
      } catch (error) {
        console.error("Failed to fetch classes", error);
      } finally {
        setClassesLoading(false);
      }
    };

    fetchClasses();
  }, [user]);


  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/update-profile", editData);
      const updatedUser: UserType = { ...user!, ...editData };
      login(updatedUser);
      setStatus({ type: "success", msg: "Profile updated successfully!" });
      setTimeout(() => {
        setIsEditing(false);
        setStatus({ type: "", msg: "" });
      }, 1000);
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
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-gray-900">

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-12 relative">

        {/* Edit Toggle Button - Absolute Positioned */}
        <button
          onClick={() => {
            setIsEditing(!isEditing);

            setStatus({ type: "", msg: "" });
          }}
          className="absolute top-6 right-6 z-20 bg-white/90 hover:bg-white backdrop-blur-md text-gray-700 hover:text-teal-600 px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 border border-gray-200 shadow-sm"
        >
          {isEditing ? (
            <>
              <X size={16} /> Cancel Edit
            </>
          ) : (
            <>
              <Edit3 size={16} /> Edit Profile
            </>
          )}
        </button>

        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-teal-600 to-teal-400"></div>

        {/* VIEW MODE */}
        {!isEditing ? (
          <div className="px-8 pb-8 md:px-12 md:pb-12 -mt-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 border border-gray-100 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                {/* Placeholder for Profile Image if we had one */}
                <User size={64} className="text-gray-300" />
              </div>
            </div>

            <div className="flex-1 pt-4 md:pt-14">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-2">{user?.username}</h1>
                  <p className="text-xl text-teal-600 font-bold flex items-center gap-2">
                    <GraduationCap size={24} />
                    {user?.role === 'TEACHER' ? ((user as any)?.qualification || "Instructor") : "Student"}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mb-6">
                {(user as any)?.bio || "No bio available."}
              </p>

              {/* Stats / Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-gray-900 font-bold truncate max-w-[200px]" title={user?.email}>{user?.email || "N/A"}</p>
                  </div>
                </div>

                {user?.role === 'TEACHER' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Qualification</p>
                      <p className="text-gray-900 font-bold truncate max-w-[200px]">{(user as any)?.qualification || "N/A"}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                    <p className="text-gray-900 font-bold">Active Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE FORM */
          <div className="px-8 pb-8 md:px-12 md:pb-12 pt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900">Edit Your Profile</h2>
              <p className="text-gray-500">Update your personal information and security settings.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Personal Info */}
              <form onSubmit={handleProfileUpdate} className="space-y-6">

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                    <Mail className="text-gray-400" size={20} />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full bg-transparent border-none outline-none font-bold text-gray-900 p-0 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Bio / About Me</label>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                    <FileText className="text-gray-400 mt-1" size={20} />
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="w-full bg-transparent border-none outline-none font-medium text-gray-600 p-0 focus:ring-0 resize-none h-24"
                    />
                  </div>
                </div>

                {/* Qualification (Teacher Only) */}
                {user?.role === "TEACHER" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Qualification</label>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                      <GraduationCap className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={editData.qualification}
                        onChange={(e) => setEditData({ ...editData, qualification: e.target.value })}
                        className="w-full bg-transparent border-none outline-none font-bold text-gray-900 p-0 focus:ring-0"
                      />
                    </div>
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} /> SAVE PROFILE
                    </>
                  )}
                </button>
              </form>

              {/* Right Column: Security */}
              <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-teal-600">
                    <Key size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Current Password</p>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">New Password</p>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1 relative">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Confirm New</p>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                      />
                      {passwords.confirmPassword && (
                        <div className={`absolute right-4 top-9 transition-colors ${passwordsMatch ? "text-green-500" : "text-red-400"}`}>
                          {passwordsMatch ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-white p-3 rounded-2xl border border-gray-100">
                    <Requirement met={requirements.length} text="8+ Characters" />
                    <Requirement met={requirements.uppercase} text="Uppercase Letter" />
                    <Requirement met={requirements.number} text="Includes Number" />
                    <Requirement met={requirements.special} text="Symbol (@$!%*?&)" />
                  </div>

                  <button
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "UPDATE PASSWORD"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Classes Section */}
      {!isEditing && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <BookOpen size={20} />
            </div>
            {user?.role === 'TEACHER' ? "Classes by You" : "My Enrolled Classes"}
          </h2>

          {classesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-teal-600" size={32} />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[32px] border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-gray-300" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {user?.role === 'TEACHER' ? "No active classes" : "No enrollments yet"}
              </h3>
              <p className="text-gray-500 mt-1">
                {user?.role === 'TEACHER' ? "You haven't listed any classes yet." : "You are not enrolled in any classes."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((cls) => (
                <ClassCard
                  key={cls.id}
                  classData={cls}
                  onClick={() => navigate(`/dashboard/browse/${cls.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
