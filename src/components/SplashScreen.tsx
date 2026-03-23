import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("hold"), 800);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
          phase === "enter"
            ? "opacity-0 scale-90 translate-y-4"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {/* Logo glow circle */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl gradient-glow glow-shadow flex items-center justify-center">
            <span className="text-4xl font-extrabold text-primary-foreground tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              B
            </span>
          </div>
          <div className="absolute -inset-3 rounded-[2rem] gradient-glow opacity-20 blur-xl animate-pulse" />
        </div>
        <h1
          className="text-3xl font-extrabold gradient-glow-text tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          BizAIra
        </h1>
        <p className="text-sm text-muted-foreground">AI Studio for Business</p>
      </div>
    </div>
  );
};

export default SplashScreen;
