import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { generateImage } from "@/lib/ai-service";
import SparkleIcon from "@/components/SparkleIcon";
import {
  ArrowRight, ArrowLeft, Upload, X, Download, RefreshCw,
  Sparkles, Loader2, Sun, Contrast, Thermometer,
  Image as ImageIcon, Layers, Tag, Type, Droplet,
} from "lucide-react";

type BgOption = "white" | "dark" | "nature" | "office" | "custom";

const BG_OPTIONS: { id: BgOption; he: string; en: string; prompt: string }[] = [
  { id: "white", he: "סטודיו לבן", en: "White Studio", prompt: "clean white studio background with soft shadows" },
  { id: "dark", he: "יוקרתי כהה", en: "Dark Luxury", prompt: "dark luxury background with dramatic lighting and soft reflections" },
  { id: "nature", he: "טבעי", en: "Natural", prompt: "natural outdoor background with soft bokeh and warm sunlight" },
  { id: "office", he: "משרד מודרני", en: "Modern Office", prompt: "modern minimalist office background with clean lines" },
  { id: "custom", he: "מותאם אישית", en: "Custom", prompt: "" },
];

const STYLES: { id: string; he: string; en: string }[] = [
  { id: "clean", he: "נקי", en: "Clean" },
  { id: "luxury", he: "יוקרתי", en: "Luxury" },
  { id: "natural", he: "טבעי", en: "Natural" },
  { id: "urban", he: "אורבני", en: "Urban" },
  { id: "soft", he: "רך", en: "Soft" },
  { id: "modern", he: "מודרני", en: "Modern" },
];

interface TextOverlay {
  productName: string;
  price: string;
  description: string;
  badge: string;
}

const ProductPhotoStudioPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const fileRef = useRef<HTMLInputElement>(null);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBg, setSelectedBg] = useState<BgOption>("white");
  const [customBg, setCustomBg] = useState("");
  const [style, setStyle] = useState("clean");
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [warmth, setWarmth] = useState(50);
  const [comparePos, setComparePos] = useState(50);
  const [sidebarTab, setSidebarTab] = useState<"upload" | "background" | "lighting" | "elements">("upload");
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({ productName: "", price: "", description: "", badge: "" });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setOriginalImage(ev.target.result as string);
        setResultImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEnhance = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    try {
      const bgOpt = BG_OPTIONS.find(b => b.id === selectedBg);
      const bgPrompt = selectedBg === "custom" && customBg ? customBg : bgOpt?.prompt || "white studio";
      const styleLabel = STYLES.find(s => s.id === style)?.en || "clean";

      let textPromptPart = "";
      if (textOverlay.productName) textPromptPart += ` Include product name text "${textOverlay.productName}" elegantly placed.`;
      if (textOverlay.price) textPromptPart += ` Show price label "${textOverlay.price}" in a clean tag/badge.`;
      if (textOverlay.badge) textPromptPart += ` Add a "${textOverlay.badge}" badge/ribbon.`;

      const prompt = `Professional product photography. Place this product on a ${bgPrompt}. Style: ${styleLabel}. Apply professional studio lighting with soft shadows. High-end commercial quality, perfect composition, premium look. Brightness: ${brightness > 50 ? "bright" : brightness < 50 ? "dark moody" : "balanced"}. Color temperature: ${warmth > 50 ? "warm golden" : warmth < 50 ? "cool blue" : "neutral"}.${textPromptPart}`;

      const result = await generateImage(prompt, originalImage);
      setResultImage(result);
    } catch (err) {
      console.error("Enhancement failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = "bizaira-product-photo.png";
    a.click();
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card border-b border-border/40 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/create" className="glass-card p-2 rounded-lg hover:scale-105 transition-all">
              <BackArrow size={18} className="text-foreground" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-foreground">{t("photo.title")}</h1>
              <p className="text-xs text-muted-foreground">{t("photo.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {resultImage && (
              <button onClick={handleDownload} className="glass-card px-3 py-2 rounded-lg text-xs font-medium text-foreground flex items-center gap-1.5 hover:scale-105 transition-all">
                <Download size={14} />
                {isHe ? "הורדה" : "Download"}
              </button>
            )}
            <SparkleIcon size={18} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-4 pt-4 gap-4">

        {/* ═══ Preview Area (compact) ═══ */}
        <div className="lg:w-[280px] w-full flex flex-col gap-3 shrink-0">
          {!originalImage ? (
            <div onClick={() => fileRef.current?.click()} className="h-[200px] rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-all group">
              <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 transition-all">
                <Upload size={24} className="text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-foreground">{isHe ? "העלה תמונת מוצר" : "Upload Product Photo"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{isHe ? "תמונה מהטלפון, לוגו, או צילום מוצר" : "Phone photo, logo, or product shot"}</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-muted/30 h-[200px]">
              <div className="absolute inset-0">
                <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                <div className="absolute top-2 start-2 glass-card px-1.5 py-0.5 rounded text-[9px] font-bold text-foreground">{isHe ? "לפני" : "Before"}</div>
              </div>
              {resultImage && (
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${comparePos}%)` }}>
                  <img src={resultImage} alt="Enhanced" className="w-full h-full object-contain" />
                  <div className="absolute top-2 end-2 glass-card px-1.5 py-0.5 rounded text-[9px] font-bold text-primary-foreground gradient-glow">{isHe ? "אחרי" : "After"}</div>
                </div>
              )}
              {resultImage && (
                <div className="absolute inset-0">
                  <input type="range" min={0} max={100} value={comparePos} onChange={e => setComparePos(Number(e.target.value))} className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-10 opacity-0 cursor-col-resize h-full" />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-lg" style={{ left: `${comparePos}%` }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                      <div className="flex gap-0.5"><div className="w-0.5 h-2.5 bg-muted-foreground rounded-full" /><div className="w-0.5 h-2.5 bg-muted-foreground rounded-full" /></div>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={() => { setOriginalImage(null); setResultImage(null); }} className="absolute top-2 end-2 glass-card p-1 rounded hover:scale-110 transition-all z-20">
                <X size={12} className="text-foreground" />
              </button>
            </div>
          )}

          <button onClick={handleEnhance} disabled={!originalImage || isProcessing} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 text-sm">
            {isProcessing ? <><Loader2 size={16} className="animate-spin" />{isHe ? "משדרג תמונה..." : "Enhancing..."}</> : <><Sparkles size={16} />{isHe ? "שדרג תמונה" : "Enhance Photo"}</>}
          </button>
          {resultImage && (
            <div className="flex gap-2">
              <button onClick={handleDownload} className="flex-1 glass-card py-2.5 rounded-xl text-xs font-bold text-foreground flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all">
                <Download size={14} />{isHe ? "הורדה" : "Download"}
              </button>
              <button onClick={() => setResultImage(null)} className="glass-card px-3 py-2.5 rounded-xl text-xs font-bold text-foreground flex items-center gap-1.5 hover:scale-[1.02] transition-all">
                <RefreshCw size={14} />
              </button>
            </div>
          )}
          <button onClick={() => fileRef.current?.click()} className="w-full glass-card py-2 rounded-xl text-xs font-medium text-muted-foreground flex items-center justify-center gap-1.5 hover:text-foreground transition-all">
            <Upload size={13} />{isHe ? "העלה תמונה חדשה" : "Upload New Photo"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </div>

        {/* ═══ Sidebar Controls ═══ */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex gap-1 glass-card rounded-xl p-1">
            {([
              { id: "upload" as const, icon: ImageIcon, label: isHe ? "תמונה" : "Image" },
              { id: "background" as const, icon: Layers, label: isHe ? "רקע" : "BG" },
              { id: "lighting" as const, icon: Sun, label: isHe ? "תאורה" : "Light" },
              { id: "elements" as const, icon: Tag, label: isHe ? "טקסט" : "Text" },
            ]).map(tab => (
              <button key={tab.id} onClick={() => setSidebarTab(tab.id)} className={`flex-1 flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg text-[10px] font-bold transition-all ${sidebarTab === tab.id ? "gradient-glow text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Upload tab */}
          {sidebarTab === "upload" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="glass-card rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-foreground">{isHe ? "סגנון עיצוב" : "Style"}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)} className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${style === s.id ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                      {isHe ? s.he : s.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Background tab */}
          {sidebarTab === "background" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="glass-card rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-foreground">{isHe ? "רקע" : "Background"}</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {BG_OPTIONS.map(bg => (
                    <button key={bg.id} onClick={() => setSelectedBg(bg.id)} className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${selectedBg === bg.id ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                      {isHe ? bg.he : bg.en}
                    </button>
                  ))}
                </div>
                {selectedBg === "custom" && (
                  <input value={customBg} onChange={e => setCustomBg(e.target.value)} placeholder={isHe ? "תאר את הרקע הרצוי..." : "Describe your desired background..."} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                )}
              </div>
            </div>
          )}

          {/* Lighting tab */}
          {sidebarTab === "lighting" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="glass-card rounded-xl p-4 space-y-4">
                {([
                  { label: isHe ? "בהירות" : "Brightness", value: brightness, set: setBrightness, icon: Sun },
                  { label: isHe ? "קונטרסט" : "Contrast", value: contrast, set: setContrast, icon: Contrast },
                  { label: isHe ? "חמימות" : "Warmth", value: warmth, set: setWarmth, icon: Thermometer },
                ]).map(slider => (
                  <div key={slider.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <slider.icon size={13} className="text-muted-foreground" />
                        <span className="text-xs font-bold text-foreground">{slider.label}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{slider.value}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={slider.value} onChange={e => slider.set(Number(e.target.value))} className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Elements/Text tab */}
          {sidebarTab === "elements" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="glass-card rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-foreground">{isHe ? "טקסט על התמונה" : "Text Overlay"}</label>
                <p className="text-[10px] text-muted-foreground">{isHe ? "הטקסט ישולב בתמונה שה-AI ייצור" : "Text will be included in the AI-generated image"}</p>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Type size={10} />{isHe ? "שם מוצר" : "Product Name"}</label>
                  <input value={textOverlay.productName} onChange={e => setTextOverlay(prev => ({ ...prev, productName: e.target.value }))} placeholder={isHe ? "לדוגמה: קרם לחות פנים" : "e.g. Facial Moisturizer"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Tag size={10} />{isHe ? "מחיר" : "Price"}</label>
                  <input value={textOverlay.price} onChange={e => setTextOverlay(prev => ({ ...prev, price: e.target.value }))} placeholder={isHe ? "לדוגמה: ₪149" : "e.g. $29.99"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Droplet size={10} />{isHe ? "תיאור קצר" : "Short Description"}</label>
                  <input value={textOverlay.description} onChange={e => setTextOverlay(prev => ({ ...prev, description: e.target.value }))} placeholder={isHe ? "לדוגמה: 100% טבעי" : "e.g. 100% Natural"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Sparkles size={10} />{isHe ? "תגית" : "Badge"}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(isHe ? ["חדש!", "מבצע", "הנמכר ביותר", "מהדורה מוגבלת"] : ["New!", "Sale", "Best Seller", "Limited Edition"]).map(badge => (
                      <button key={badge} onClick={() => setTextOverlay(prev => ({ ...prev, badge: prev.badge === badge ? "" : badge }))} className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${textOverlay.badge === badge ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPhotoStudioPage;
