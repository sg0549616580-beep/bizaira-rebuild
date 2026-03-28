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
        className={`flex flex-col items-center gap-5 transition-all duration-700 ease-out ${
          phase === "enter"
            ? "opacity-0 scale-90 translate-y-4"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {/* Logo — navy circle with gold B */}
        <div className="relative">
          <div className="w-20 h-20 rounded-[22px] gradient-glow glow-shadow flex items-center justify-center">
            <span
              className="text-3xl font-black"
              style={{ color: "hsl(39 48% 56%)", fontFamily: "'Heebo', sans-serif", letterSpacing: "-0.03em" }}
            >
              B
            </span>
          </div>
          <div className="absolute -inset-3 rounded-[2rem] gradient-glow opacity-15 blur-xl animate-pulse" />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ color: "hsl(210 100% 12%)", fontFamily: "'Heebo', sans-serif", letterSpacing: "-0.03em" }}
          >
            BizAIra
          </h1>
          {/* Gold divider */}
          <div className="w-16 h-px mx-auto my-2" style={{ background: "hsl(39 48% 56%)" }} />
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: "hsl(39 48% 56%)" }}
          >
            Strategic Business Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
