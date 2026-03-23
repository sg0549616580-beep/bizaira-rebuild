import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface VideoPreviewProps {
  businessName: string;
  businessField: string;
  slogan: string;
  freeText: string;
  style: string;
  music: string;
  duration: string;
  images: string[];
  textStyle: string;
}

const styleColors: Record<string, { bg: string; accent: string; text: string }> = {
  "יוקרתי": { bg: "from-[#1a1a2e] to-[#16213e]", accent: "text-amber-300", text: "text-white" },
  "נקי": { bg: "from-[#f0f0f0] to-[#e8e8e8]", accent: "text-blue-600", text: "text-gray-900" },
  "רגשי": { bg: "from-[#2d1b3d] to-[#1a1028]", accent: "text-pink-300", text: "text-white" },
  "מודרני": { bg: "from-[#0f172a] to-[#1e293b]", accent: "text-cyan-400", text: "text-white" },
  "צעיר": { bg: "from-[#1e1b4b] to-[#312e81]", accent: "text-violet-300", text: "text-white" },
  "אלגנטי": { bg: "from-[#1c1917] to-[#292524]", accent: "text-amber-200", text: "text-stone-100" },
};

const VideoPreview = ({
  businessName,
  businessField,
  slogan,
  freeText,
  style,
  duration,
  images,
  textStyle,
}: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const durationMs = duration === "short" ? 6000 : duration === "medium" ? 10000 : 15000;
  const totalScenes = 4;
  const sceneTime = durationMs / totalScenes;

  const colors = styleColors[style] || styleColors["מודרני"];

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentScene(0);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const startTime = Date.now() - progress * durationMs;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / durationMs, 1);
      setProgress(p);
      setCurrentScene(Math.min(Math.floor(p * totalScenes), totalScenes - 1));
      if (p >= 1) {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, durationMs]);

  const displayName = businessName || "שם העסק";
  const displayField = businessField || "תחום העסק";
  const displaySlogan = slogan || "הסלוגן שלך כאן";
  const displayText = freeText || "טקסט שיווקי מותאם אישית לעסק שלך";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phone frame */}
      <div className="relative w-[280px] md:w-[320px] aspect-[9/16] rounded-[2rem] border-4 border-border/60 overflow-hidden shadow-2xl bg-black">
        {/* Video content */}
        <div className={`absolute inset-0 bg-gradient-to-b ${colors.bg} transition-all duration-1000`}>
          
          {/* Scene 0: Opening - Logo & Business Name */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-700 ${
              currentScene === 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {images[0] ? (
              <img src={images[0]} alt="logo" className="w-24 h-24 rounded-2xl object-cover mb-6 shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur mb-6 flex items-center justify-center text-4xl shadow-lg">
                ✨
              </div>
            )}
            <h2 className={`text-2xl font-black ${colors.text} text-center mb-3 ${isPlaying ? "animate-fade-in-up" : ""}`}>
              {displayName}
            </h2>
            <p className={`text-sm ${colors.accent} font-medium text-center`}>
              {displayField}
            </p>
          </div>

          {/* Scene 1: Slogan + Image */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-700 ${
              currentScene === 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {images[1] ? (
              <img
                src={images[1]}
                alt="product"
                className={`w-48 h-48 rounded-xl object-cover mb-6 shadow-2xl ${isPlaying ? "animate-slow-zoom" : ""}`}
              />
            ) : (
              <div className={`w-48 h-48 rounded-xl bg-white/5 backdrop-blur mb-6 flex items-center justify-center text-6xl ${isPlaying ? "animate-slow-zoom" : ""}`}>
                🏢
              </div>
            )}
            <h3 className={`text-xl font-bold ${colors.text} text-center leading-relaxed ${isPlaying ? "animate-fade-in-up" : ""}`}>
              {displaySlogan}
            </h3>
          </div>

          {/* Scene 2: Free text / Features */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-8 transition-all duration-700 ${
              currentScene === 2 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent mb-8" />
            <p className={`text-base ${colors.text} text-center leading-loose font-medium ${isPlaying ? "animate-fade-in-up" : ""}`}>
              {displayText}
            </p>
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-accent to-primary mt-8" />
          </div>

          {/* Scene 3: CTA */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-700 ${
              currentScene === 3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {images[0] ? (
              <img src={images[0]} alt="logo" className="w-16 h-16 rounded-xl object-cover mb-6 shadow-lg" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur mb-6 flex items-center justify-center text-2xl">
                ✨
              </div>
            )}
            <h2 className={`text-xl font-black ${colors.text} text-center mb-4 ${isPlaying ? "animate-fade-in-up" : ""}`}>
              {displayName}
            </h2>
            <div className={`gradient-glow px-6 py-3 rounded-xl ${isPlaying ? "animate-glow-pulse" : ""}`}>
              <span className="text-primary-foreground font-bold text-sm">
                📞 צרו קשר עכשיו
              </span>
            </div>
            <p className={`text-xs ${colors.accent} mt-4 font-medium`}>
              {displaySlogan}
            </p>
          </div>

          {/* Subtle overlay grain */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className="h-full gradient-glow transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Scene indicators */}
        <div className="absolute top-3 left-3 right-3 flex gap-1">
          {Array.from({ length: totalScenes }).map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20">
              <div
                className="h-full bg-white/80 transition-all duration-300"
                style={{
                  width: currentScene > i ? "100%" : currentScene === i ? `${((progress * totalScenes) % 1) * 100}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="glass-card p-2.5 rounded-full hover:scale-110 transition-all"
        >
          <RotateCcw size={18} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="gradient-glow glow-shadow p-4 rounded-full hover:scale-110 transition-all"
        >
          {isPlaying ? (
            <Pause size={24} className="text-primary-foreground" />
          ) : (
            <Play size={24} className="text-primary-foreground mr-[-2px]" />
          )}
        </button>
        <div className="text-xs text-muted-foreground font-medium">
          סצנה {currentScene + 1}/{totalScenes}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
