import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext, type User } from "../context/AuthContext";

const GoogleCallback: React.FC = () => {
  // 1. Accessing context safely
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    throw new Error("GoogleCallback must be used within an AuthProvider");
  }

  const { login } = auth;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 2. Typing the Axios GET request with our User interface
        // This ensures response.data is treated as a User
        const response = await api.get<User>("/me");

        if (response.data) {
          // 3. Log them in inside the React state
          login(response.data);
          // navigate("/dashboard") is usually handled inside your login function,
          // but if not, you can add it here.
        }
      } catch (err) {
        console.error("Google Login Failed", err);
        navigate("/login?error=true");
      }
    };

    fetchUserData();
  }, [login, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="p-10 bg-white rounded-[40px] shadow-2xl flex flex-col items-center border border-gray-100">
        <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">
          Processing Google Login
        </h2>
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">
          Securing your session...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
