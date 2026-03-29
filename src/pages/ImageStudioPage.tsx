import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { generateImage } from "@/lib/ai-service";
import { trackCreation, trackDownload } from "@/lib/activity-tracker";
import SparkleIcon from "@/components/SparkleIcon";
import {
  ArrowRight, ArrowLeft, Upload, X, Download, RefreshCw,
  Sparkles, Loader2, Paintbrush, Layers, Palette, Type,
  Image as ImageIcon, Square, RectangleHorizontal, RectangleVertical, Lock,
} from "lucide-react";

type ImageType = "product" | "profile" | "logo" | "banner";
type StyleId = "realistic" | "minimal" | "luxury" | "cartoon" | "soft" | "modern";

const IMAGE_TYPES: { id: ImageType; he: string; en: string }[] = [
  { id: "product", he: "תמונת מוצר", en: "Product" },
  { id: "profile", he: "פרופיל עסקי", en: "Profile" },
  { id: "logo", he: "לוגו", en: "Logo" },
  { id: "banner", he: "באנר", en: "Banner" },
];

const STYLES: { id: StyleId; he: string; en: string }[] = [
  { id: "realistic", he: "ריאליסטי", en: "Realistic" },
  { id: "minimal", he: "מינימליסטי", en: "Minimalist" },
  { id: "luxury", he: "יוקרתי", en: "Luxury" },
  { id: "cartoon", he: "אילוסטרציה", en: "Illustration" },
  { id: "soft", he: "רך ועדין", en: "Soft" },
  { id: "modern", he: "מודרני", en: "Modern" },
];

const PRESET_COLORS = [
  "#ffffff", "#111111", "#f5f0e8", "#1a1a3e", "#f5e0e0", "#d4ddd0",
  "#fef3c7", "#dbeafe", "#fce7f3", "#d1fae5", "#e0e7ff", "#fde68a",
];

const RATIOS = [
  { id: "1:1", icon: Square, label: "1:1" },
  { id: "4:3", icon: RectangleHorizontal, label: "4:3" },
  { id: "9:16", icon: RectangleVertical, label: "9:16" },
  { id: "16:9", icon: RectangleHorizontal, label: "16:9" },
];

const USAGE_KEY = "bizaira_image_studio_usage";

function getUsage(): { count: number; month: number } {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { count: 0, month: new Date().getMonth() };
    const parsed = JSON.parse(raw);
    if (parsed.month !== new Date().getMonth()) return { count: 0, month: new Date().getMonth() };
    return parsed;
  } catch { return { count: 0, month: new Date().getMonth() }; }
}

function incrementUsage() {
  const usage = getUsage();
  usage.count += 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

const ImageStudioPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [imageType, setImageType] = useState<ImageType>("product");
  const [style, setStyle] = useState<StyleId>("realistic");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [ratio, setRatio] = useState("1:1");
  const [description, setDescription] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"type" | "style" | "details">("type");

  const usage = getUsage();
  const isLocked = usage.count >= 5;
  const remaining = Math.max(0, 5 - usage.count);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setUploadedImage(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (isLocked) return;
    setIsGenerating(true);
    setResults([]);
    try {
      const typeMap: Record<string, string> = {
        product: "professional product photograph", profile: "professional business profile portrait",
        logo: "modern clean logo design", banner: "marketing banner image",
      };
      const styleMap: Record<string, string> = {
        realistic: "photorealistic, high-end studio quality", minimal: "minimalist, clean lines, lots of whitespace",
        luxury: "luxury premium, elegant, sophisticated", cartoon: "modern illustration style, clean vectors",
        soft: "soft, gentle, warm dreamy aesthetic", modern: "contemporary modern, bold and crisp",
      };

      const base = `Create a ${typeMap[imageType]}. Style: ${styleMap[style]}. Background color: ${bgColor}. Aspect ratio: ${ratio}. ${description ? `Details: ${description}.` : ""} Professional quality, perfect composition, high resolution.`;

      const promises = [
        generateImage(base, uploadedImage || undefined),
        generateImage(base + " Alternative composition.", uploadedImage || undefined),
      ];

      const settled = await Promise.allSettled(promises);
      const images = settled.filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled").map(r => r.value);

      if (images.length === 0) throw new Error("Generation failed");
      setResults(images);
      setActiveResult(0);
      incrementUsage();
      trackCreation(); // Track the creation action
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (index: number) => {
    const img = results[index];
    if (!img) return;
    const a = document.createElement("a");
    a.href = img;
    a.download = `bizaira-image-${index + 1}.png`;
    a.click();
    trackDownload(); // Track the download action
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
              <h1 className="text-base font-bold text-foreground">{isHe ? "סטודיו תמונות" : "Image Studio"}</h1>
              <p className="text-xs text-muted-foreground">{isHe ? "יצירת תמונות מקצועיות עם AI" : "Create professional images with AI"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Usage counter */}
            <div className={`glass-card px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${isLocked ? "text-red-500" : "text-foreground"}`}>
              {isLocked ? <Lock size={12} /> : <Sparkles size={12} />}
              {remaining}/5
            </div>
            <SparkleIcon size={18} />
          </div>
        </div>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <div className="max-w-6xl mx-auto w-full px-4 pt-6">
          <div className="glass-card rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Lock size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{isHe ? "הגעת למגבלה החודשית" : "Monthly Limit Reached"}</h2>
            <p className="text-sm text-muted-foreground">{isHe ? "השתמשת ב-5 פעולות החודש. הכ��י ייפתח מחדש בחודש הבא." : "You've used 5 actions this month. The tool will unlock next month."}</p>
            <Link to="/pricing" className="inline-block gradient-glow text-primary-foreground font-bold px-6 py-3 rounded-xl hover:scale-[1.02] transition-all">
              {isHe ? "שדרג ל-PRO" : "Upgrade to PRO"}
            </Link>
          </div>
        </div>
      )}

      {!isLocked && (
        <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-4 pt-4 gap-4">
          {/* ═══ Preview Area ═══ */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-muted/20 border border-border/30 min-h-[320px] flex items-center justify-center relative">
              {results.length > 0 ? (
                <img src={results[activeResult]} alt={`Generated ${activeResult + 1}`} className="w-full h-full object-contain max-h-[500px]" />
              ) : uploadedImage ? (
                <div className="relative w-full h-full min-h-[320px] flex items-center justify-center">
                  <img src={uploadedImage} alt="Uploaded" className="max-h-[400px] object-contain" />
                  <button onClick={() => setUploadedImage(null)} className="absolute top-3 end-3 glass-card p-1.5 rounded-lg hover:scale-110 transition-all">
                    <X size={14} className="text-foreground" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 opacity-60">
                  <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
                    <Paintbrush size={28} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{isHe ? "התמונות שלך יופיעו כאן" : "Your images will appear here"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{isHe ? "מלא פרטים ולחץ ׳צור תמונות׳" : "Fill details and click 'Create Images'"}</p>
                </div>
              )}
            </div>

            {results.length > 1 && (
              <div className="flex gap-2 justify-center">
                {results.map((img, i) => (
                  <button key={i} onClick={() => setActiveResult(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${activeResult === i ? "border-primary glow-shadow" : "border-border/30 opacity-60"}`}>
                    <img src={img} alt={`V${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={handleGenerate} disabled={isGenerating} className="flex-1 gradient-glow glow-shadow text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
                {isGenerating ? <><Loader2 size={18} className="animate-spin" />{isHe ? "יוצר תמונות..." : "Creating..."}</> : <><Sparkles size={18} />{isHe ? "צור תמונות" : "Create Images"}</>}
              </button>
              {results.length > 0 && (
                <button onClick={() => handleDownload(activeResult)} className="glass-card px-4 py-3.5 rounded-xl text-sm font-bold text-foreground flex items-center gap-1.5 hover:scale-[1.02] transition-all">
                  <Download size={16} />
                </button>
              )}
            </div>

            <button onClick={() => fileRef.current?.click()} className="w-full glass-card py-3 rounded-xl text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 hover:text-foreground hover:scale-[1.01] transition-all">
              <Upload size={16} />
              {isHe ? "העלה תמונת מקור (אופציונלי)" : "Upload reference image (optional)"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>

          {/* ═══ Sidebar Controls ═══ */}
          <div className="lg:w-80 w-full space-y-4">
            <div className="flex gap-1 glass-card rounded-xl p-1">
              {([
                { id: "type" as const, icon: ImageIcon, label: isHe ? "סוג" : "Type" },
                { id: "style" as const, icon: Palette, label: isHe ? "סגנון" : "Style" },
                { id: "details" as const, icon: Type, label: isHe ? "פרטים" : "Details" },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setSidebarTab(tab.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${sidebarTab === tab.id ? "gradient-glow text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {sidebarTab === "type" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground">{isHe ? "סוג תמונה" : "Image Type"}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {IMAGE_TYPES.map(it => (
                      <button key={it.id} onClick={() => setImageType(it.id)} className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${imageType === it.id ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {isHe ? it.he : it.en}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground">{isHe ? "יחס תמונה" : "Aspect Ratio"}</label>
                  <div className="flex gap-1.5">
                    {RATIOS.map(r => (
                      <button key={r.id} onClick={() => setRatio(r.id)} className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all ${ratio === r.id ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        <r.icon size={14} />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {sidebarTab === "style" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground">{isHe ? "סגנון עיצוב" : "Design Style"}</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {STYLES.map(s => (
                      <button key={s.id} onClick={() => setStyle(s.id)} className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${style === s.id ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {isHe ? s.he : s.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground">{isHe ? "צבע רקע" : "Background Color"}</label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => { setBgColor(c); setCustomColor(c); }} className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${bgColor === c ? "border-primary ring-2 ring-primary/30" : "border-border/50"}`} style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-[10px] text-muted-foreground">{isHe ? "צבע מותאם:" : "Custom:"}</label>
                    <input type="color" value={customColor} onChange={e => { setCustomColor(e.target.value); setBgColor(e.target.value); }} className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground font-mono">{customColor}</span>
                  </div>
                </div>
              </div>
            )}

            {sidebarTab === "details" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground">{isHe ? "תיאור התמונה" : "Image Description"}</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={isHe ? "תאר את התמונה שתרצה ליצור..." : "Describe the image you want to create..."} rows={5} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground">{isHe ? "רעיונות מהירים" : "Quick Ideas"}</label>
                  <div className="space-y-1.5">
                    {(isHe ? ["תמונת מוצר על רקע שיש לבן עם צל רך", "לוגו מודרני עם אותיות נקיות", "תמונת פרופיל עסקי עם תאורת סטודיו", "באנר שיווקי עם גרדיאנט מודרני"] : ["Product photo on white marble with soft shadow", "Modern logo with clean typography", "Business profile with studio lighting", "Marketing banner with modern gradient"]).map(idea => (
                      <button key={idea} onClick={() => setDescription(idea)} className="w-full text-start bg-muted/50 hover:bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-all">{idea}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageStudioPage;
