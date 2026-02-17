import React, { useEffect, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Users,
  Shield,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";

// 1. Define types for the FeatureCard props
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 2. Safe Context Access
  const auth = useContext(AuthContext);
  const user = auth?.user;

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-teal-100 to-teal-600 relative font-sans overflow-x-hidden">
      {/* Background overlay removed */}

      {/* --- GLASS NAVBAR --- */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-500/20">
            <BookOpen className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase">
            ELP<span className="text-teal-400">.</span>
          </span>
        </div>

        <div className="hidden md:flex gap-10 text-teal-900/90 font-black text-[10px] tracking-[0.3em] uppercase">
          <a href="#features" className="hover:text-teal-600 hover:scale-105 transition-all">
            Features
          </a>
          <a href="#about" className="hover:text-teal-600 hover:scale-105 transition-all">
            About
          </a>
          <a href="#support" className="hover:text-white transition-colors">
            Support
          </a>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 rounded-2xl text-teal-900 font-bold text-xs uppercase tracking-widest hover:bg-teal-900/5 transition-all border border-teal-900/20 backdrop-blur-md"
          >
            LOG IN
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-500/40"
          >
            GET STARTED
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32 text-center md:text-left flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-teal-300 text-[10px] font-black uppercase tracking-[0.25em]">
            <Star size={14} className="text-teal-400 text-teal-400" />
            Empowering Future Leaders
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Master Your <br /> <span className="text-teal-400">Education</span>{" "}
            <br /> In Style.
          </h1>

          <p className="text-xl text-teal-800/70 max-w-lg leading-relaxed font-medium">
            A modern ecosystem designed for seamless collaboration between
            students and teachers. Secure, fast, and remarkably beautiful.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => navigate("/register")}
              className="group px-10 py-5 bg-white text-teal-900 font-black rounded-[24px] hover:bg-teal-50 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
            >
              JOIN THE ACADEMY{" "}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* --- FLOATING FEATURES GLASS CARD GRID --- */}
        <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right duration-1000">
          <FeatureCard
            icon={<Users size={28} />}
            title="Collaborative"
            desc="Advanced tools for real-time student-teacher interaction."
          />
          <ShieldCard />
          <FeatureCard
            icon={<CheckCircle size={28} />}
            title="Certified"
            desc="Earn recognized credentials for your course completions."
          />
          <div className="p-8 bg-teal-600 rounded-[40px] shadow-2xl text-white space-y-5 border border-teal-400/30">
            <h4 className="text-2xl font-black leading-tight">
              Ready to excel?
            </h4>
            <p className="text-teal-100 text-xs font-bold leading-relaxed opacity-80 uppercase tracking-wider">
              Join thousands of students and teachers today.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-4 bg-white text-teal-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-teal-50 transition-colors shadow-lg"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 max-w-7xl mx-auto px-8 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-black text-white/90">EDURA ACADEMY</span>
          <p className="text-white/30 text-[10px] font-black tracking-[0.2em] uppercase">
            © 2026 EDURA SYSTEMS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Typed Helper Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => (
  <div className="p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] hover:bg-white/15 transition-all group cursor-default">
    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:bg-teal-600 transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-black text-teal-900 mb-2">{title}</h3>
    <p className="text-teal-800/80 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

// Separate component for specific icon handling if needed
const ShieldCard = () => (
  <FeatureCard
    icon={<Shield size={28} />}
    title="Bank-Grade"
    desc="Your data is protected by industry-leading encryption."
  />
);

export default Home;
