import { useEffect, useState, useRef } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("hold"), 800);
    const exitTimer  = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer  = setTimeout(() => onCompleteRef.current(), 2800);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-6 transition-all duration-700 ease-out ${
          phase === "enter"
            ? "opacity-0 scale-90 translate-y-4"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {/* Logo — elegant gold/lilac minimalist aesthetic */}
        <div className="relative">
          {/* Soft glow background */}
          <div 
            className="absolute -inset-4 rounded-[2rem] blur-2xl animate-pulse opacity-40"
            style={{ 
              background: "linear-gradient(135deg, hsl(39 48% 56% / 0.5), hsl(270 30% 70% / 0.4))" 
            }}
          />
          {/* Main logo container */}
          <div 
            className="relative w-20 h-20 rounded-[22px] flex items-center justify-center shadow-xl"
            style={{ 
              background: "linear-gradient(145deg, hsl(39 48% 56%), hsl(39 55% 45%))",
              boxShadow: "0 8px 32px -4px hsl(39 48% 56% / 0.4), 0 4px 16px -2px hsl(270 30% 60% / 0.25)"
            }}
          >
            <span
              className="text-3xl font-black"
              style={{ 
                color: "hsl(0 0% 100%)", 
                fontFamily: "'Heebo', sans-serif", 
                letterSpacing: "-0.03em",
                textShadow: "0 2px 4px hsl(39 50% 35% / 0.3)"
              }}
            >
              B
            </span>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ 
              background: "linear-gradient(135deg, hsl(39 48% 56%), hsl(270 30% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Heebo', sans-serif", 
              letterSpacing: "-0.03em" 
            }}
          >
            BizAIra
          </h1>
          {/* Gold/lilac gradient divider */}
          <div 
            className="w-20 h-0.5 mx-auto my-2.5 rounded-full" 
            style={{ background: "linear-gradient(90deg, transparent, hsl(39 48% 56%), hsl(270 30% 65%), transparent)" }} 
          />
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: "hsl(270 20% 50%)" }}
          >
            Strategic Business Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
