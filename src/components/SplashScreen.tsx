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
        {/* Illustration image */}
        <div className="relative">
          {/* Soft glow background */}
          <div 
            className="absolute -inset-8 rounded-full blur-3xl animate-pulse opacity-30"
            style={{ 
              background: "linear-gradient(135deg, hsl(270 40% 75% / 0.6), hsl(270 30% 85% / 0.5))" 
            }}
          />
          {/* Illustration */}
          <img 
            src="/images/bizaira-illustration.png"
            alt="BizAIra"
            className="relative w-32 h-32 object-contain"
          />
        </div>

        {/* Brand name — dark navy blue */}
        <div className="text-center">
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ 
              color: "hsl(210 100% 12%)",
              fontFamily: "'Heebo', sans-serif", 
              letterSpacing: "-0.03em" 
            }}
          >
            BizAIra
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
