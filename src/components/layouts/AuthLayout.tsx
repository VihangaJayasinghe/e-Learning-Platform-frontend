import React, { useState, useEffect } from "react";
import logo from "../../src/images/edura_logo.png";

interface AuthLayoutProps {
    children: React.ReactNode;
    imageSrc: string;
    title?: string;
    subtitle?: string;
    reverse?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    imageSrc,
    title,
    subtitle,
    reverse = false,
}) => {
    const [currentImage, setCurrentImage] = useState(imageSrc);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (imageSrc !== currentImage) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setCurrentImage(imageSrc);
                setIsTransitioning(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [imageSrc, currentImage]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0d9488] via-teal-50 to-white p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(100px) translateY(-20px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes move-across {
          0% { transform: translateX(-100px) rotate(0deg); }
          50% { transform: translateX(100px) rotate(5deg); }
          100% { transform: translateX(-100px) rotate(0deg); }
        }
        @keyframes move-across-slow {
          0% { transform: translateX(-150px) translateY(0px); }
          50% { transform: translateX(150px) translateY(-30px); }
          100% { transform: translateX(-150px) translateY(0px); }
        }
        @keyframes move-across-reverse {
          0% { transform: translateX(100px) rotate(0deg); }
          50% { transform: translateX(-100px) rotate(-5deg); }
          100% { transform: translateX(100px) rotate(0deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.05; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float 12s ease-in-out infinite; }
        .animate-drift { animation: drift 20s ease-in-out infinite; }
        .animate-move-across { animation: move-across 25s ease-in-out infinite; }
        .animate-move-across-slow { animation: move-across-slow 35s ease-in-out infinite; }
        .animate-move-across-reverse { animation: move-across-reverse 30s ease-in-out infinite; }
        .animate-spin-super-slow { animation: spin-slow 80s linear infinite; }
        .animate-pulse-slow { animation: pulse-scale 10s ease-in-out infinite; }
      `}</style>

            {/* --- Animated Background Logos (Two Variants based on 'reverse' prop) --- */}
            {/* Added responsive sizing (w-[mobile] md:w-[desktop]) */}

            {/* 1. Large Drifter */}
            <img
                src={logo} alt=""
                className={`absolute w-[300px] md:w-[600px] lg:w-[900px] h-auto opacity-[0.06] pointer-events-none z-0 rotate-12 mix-blend-multiply grayscale animate-move-across-slow transition-all duration-1000
            ${reverse ? 'left-[-20%] bottom-[-10%]' : 'right-[-15%] top-[-20%]'}`}
            />

            {/* 2. Medium Floater */}
            <img
                src={logo} alt=""
                className={`absolute w-[250px] md:w-[450px] lg:w-[700px] h-auto opacity-[0.08] pointer-events-none z-0 -rotate-6 mix-blend-multiply grayscale animate-float-slow transition-all duration-1000
            ${reverse ? 'right-[-10%] top-[10%]' : 'left-[-10%] bottom-[-15%]'}`}
            />

            {/* 3. Spinner */}
            <img
                src={logo} alt=""
                className={`absolute w-[120px] md:w-[200px] lg:w-[350px] h-auto opacity-[0.1] pointer-events-none z-0 mix-blend-multiply grayscale blur-[1px] animate-spin-super-slow transition-all duration-1000
             ${reverse ? 'left-[40%] top-[40%]' : 'left-[5%] top-[25%]'}`}
            />

            {/* 4. Massive Drifter Reverse */}
            <img
                src={logo} alt=""
                className={`absolute w-[400px] md:w-[800px] lg:w-[1200px] h-auto opacity-[0.04] pointer-events-none z-0 -rotate-12 mix-blend-multiply grayscale animate-move-across-reverse transition-all duration-1000
             ${reverse ? 'right-[20%] top-[-10%]' : 'right-[-5%] bottom-[-35%]'}`}
            />

            {/* 5. Top Center Floater */}
            <img
                src={logo} alt=""
                className={`absolute w-[150px] md:w-[300px] lg:w-[400px] h-auto opacity-[0.07] pointer-events-none z-0 rotate-[150deg] mix-blend-multiply grayscale animate-move-across transition-all duration-1000
             ${reverse ? 'left-[10%] bottom-[20%]' : 'left-[35%] top-[-15%]'}`}
            />

            {/* 6. Pulse */}
            <img
                src={logo} alt=""
                className={`absolute w-[120px] md:w-[200px] lg:w-[300px] h-auto pointer-events-none z-0 rotate-45 mix-blend-multiply grayscale animate-pulse-slow transition-all duration-1000
             ${reverse ? 'right-[50%] bottom-[-5%]' : 'right-[10%] top-[35%]'}`}
            />

            {/* 7. Tiny Floater */}
            <img
                src={logo} alt=""
                className={`absolute w-[100px] md:w-[180px] lg:w-[250px] h-auto opacity-[0.12] pointer-events-none z-0 rotate-12 mix-blend-multiply grayscale animate-float-slow transition-all duration-1000
             ${reverse ? 'right-[5%] bottom-[40%]' : 'left-[45%] bottom-[-5%]'}`}
            />

            {/* 8. Corner Drifter */}
            <img
                src={logo} alt=""
                className={`absolute w-[180px] md:w-[300px] lg:w-[500px] h-auto opacity-[0.05] pointer-events-none z-0 -rotate-45 mix-blend-multiply grayscale animate-move-across transition-all duration-1000
             ${reverse ? 'left-[-5%] top-[5%]' : 'left-[-5%] top-[-5%]'}`}
            />

            {/* Centered Card Container */}
            {/* Mobile: h-auto min-h-[500px]. Desktop: h-[700px] fixed. */}
            {/* Mobile: rounded-xl. Desktop: rounded-[30px]. */}
            <div className={`relative z-10 w-full max-w-[1100px] 
          min-h-[500px] lg:min-h-0 lg:h-[700px] 
          bg-white rounded-2xl lg:rounded-[30px] 
          shadow-2xl overflow-hidden flex flex-col lg:flex-row 
          transition-all duration-500 
          ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
            >

                {/* Form Area */}
                <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-8 lg:p-12 overflow-y-auto h-full bg-white relative no-scrollbar">
                    <div className="mb-6 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-8">
                            <img src={logo} alt="EDURA" className="w-8 h-8 object-contain" />
                            <span className="font-bold text-xl tracking-tight text-teal-900">EDURA</span>
                        </div>

                        {title && <h1 className="text-2xl sm:text-3xl font-black text-teal-950 mb-2 tracking-tight">{title}</h1>}
                        {subtitle && <p className="text-gray-500 font-medium text-sm sm:text-base">{subtitle}</p>}
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        {children}
                    </div>

                    <div className="mt-8 text-xs font-medium text-gray-400 flex-shrink-0">
                        © {new Date().getFullYear()} EDURA. All rights reserved.
                    </div>
                </div>

                {/* Image Area - Hidden on Mobile */}
                <div className="hidden lg:block w-1/2 relative bg-teal-50 overflow-hidden h-full">
                    <div
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
                    >
                        <img
                            src={currentImage}
                            alt="Auth Background"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply pointer-events-none"></div>
                </div>

            </div>
        </div>
    );
};

export default AuthLayout;
