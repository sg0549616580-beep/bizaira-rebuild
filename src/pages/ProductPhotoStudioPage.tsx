import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { generateImage } from "@/lib/ai-service";
import { trackCreation, trackDownload } from "@/lib/activity-tracker";
import SparkleIcon from "@/components/SparkleIcon";
import {
  ArrowRight, ArrowLeft, Upload, X, Download, RefreshCw,
  Sparkles, Loader2, Sun, Contrast, Thermometer,
  Image as ImageIcon, Layers, Tag, Type, Droplet,
  Camera, User, Palette, ChevronRight, ChevronLeft, ShieldCheck,
} from "lucide-react";

type ProductType = "product" | "logo" | "profile" | "story";
type DesignStyle = "minimal" | "card" | "luxury" | "modern" | "soft" | "clean";

const PRODUCT_TYPES: { id: ProductType; he: string; en: string; icon: typeof Camera }[] = [
  { id: "product", he: "תמונת מוצר", en: "Product Photo", icon: Camera },
  { id: "logo", he: "לוגו", en: "Logo", icon: Sparkles },
  { id: "profile", he: "פרופיל עסקי", en: "Business Profile", icon: User },
  { id: "story", he: "סטורי", en: "Story", icon: Layers },
];

const DESIGN_STYLES: { id: DesignStyle; he: string; en: string }[] = [
  { id: "minimal", he: "מינימלי", en: "Minimalist" },
  { id: "card", he: "כרטיס", en: "Card" },
  { id: "luxury", he: "יוקרתי", en: "Luxury" },
  { id: "modern", he: "מודרני", en: "Modern" },
  { id: "soft", he: "רך ועדין", en: "Soft" },
  { id: "clean", he: "נקי", en: "Clean" },
];

const BG_COLORS = [
  "#ffffff", "#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827", "#000000",
  "#fef2f2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a",
  "#fff7ed", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#431407",
  "#fefce8", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006",
  "#f0fdf4", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16",
  "#f0fdfa", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#042f2e",
  "#eff6ff", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554",
  "#eef2ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b",
  "#faf5ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87", "#3b0764",
  "#fdf2f8", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843", "#500724",
  "#fff1f2", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519",
];



// Type-specific customizations
const LOGO_IDEAS = [
  { he: "לוגו מודרני עם טיפוגרפיה", en: "Modern typography logo" },
  { he: "לוגו אייקוני מינימלי", en: "Minimal icon logo" },
  { he: "לוגו עם גרדיאנט צבעוני", en: "Gradient color logo" },
  { he: "לוגו בסגנון חותמת", en: "Stamp style logo" },
];

const PROFILE_POSES = [
  { he: "עומד/ת — מבט ישר", en: "Standing — direct gaze" },
  { he: "יושב/ת — חצי גוף", en: "Sitting — half body" },
  { he: "תקריב פנים מקצועי", en: "Professional headshot" },
  { he: "עמידה צדדית אלגנטית", en: "Elegant side pose" },
];

interface TextOverlay {
  productName: string;
  price: string;
  description: string;
  badge: string;
}

type WizardStep = "type" | "upload" | "style" | "customize";

const ProductPhotoStudioPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const NextArrow = isHe ? ChevronLeft : ChevronRight;
  const PrevArrow = isHe ? ChevronRight : ChevronLeft;
  const fileRef = useRef<HTMLInputElement>(null);

  // Wizard state
  const [step, setStep] = useState<WizardStep>("type");
  const [productType, setProductType] = useState<ProductType>("product");
  const [designStyle, setDesignStyle] = useState<DesignStyle>("minimal");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({ productName: "", price: "", description: "", badge: "" });

  // Profile-specific
  const [selectedPose, setSelectedPose] = useState(0);
  const [bodyType, setBodyType] = useState("");
  const [clothingStyle, setClothingStyle] = useState("");
  const [headCovering, setHeadCovering] = useState(false);

  // Logo-specific
  const [selectedLogoIdea, setSelectedLogoIdea] = useState(0);

  const steps: WizardStep[] = ["type", "upload", "style", "customize"];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

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
    setIsProcessing(true);
    try {
      const styleLabel = DESIGN_STYLES.find(s => s.id === designStyle)?.en || "minimalist";
      const bgDesc = `background color ${bgColor}`;

      let prompt = "";

      if (productType === "logo") {
        const idea = LOGO_IDEAS[selectedLogoIdea]?.en || "modern logo";
        prompt = `Create a ${idea}. Style: ${styleLabel}. Background: ${bgDesc}. Professional, clean, high resolution. Perfect for business branding.`;
      } else if (productType === "profile") {
        const pose = PROFILE_POSES[selectedPose]?.en || "professional headshot";
        let extras = "";
        if (bodyType) extras += ` Body type: ${bodyType}.`;
        if (clothingStyle) extras += ` Clothing: ${clothingStyle}.`;
        if (headCovering) extras += ` Include head covering.`;
        prompt = `Professional business profile photo. Pose: ${pose}. Style: ${styleLabel}. Background: ${bgDesc}.${extras} High-end quality, realistic, professional look.`;
      } else if (productType === "story") {
        prompt = `Professional Instagram/Facebook story image. Style: ${styleLabel}. Background: ${bgDesc}. Vertical format 9:16 aspect ratio, eye-catching, social media ready, modern design.`;
      } else {
        prompt = `Professional product photography. Style: ${styleLabel}. Background: ${bgDesc}. Studio lighting, soft shadows, high-end commercial quality, perfect composition.`;
      }

      // Add text overlay instructions with exact text preservation
      if (textOverlay.productName) prompt += ` Include product name text exactly as: "${textOverlay.productName}" — preserve this text character by character.`;
      if (textOverlay.price) prompt += ` Show price label exactly as: "${textOverlay.price}" — preserve exactly as written.`;
      if (textOverlay.description) prompt += ` Include description exactly as: "${textOverlay.description}" — keep exact spelling.`;
      if (textOverlay.badge) prompt += ` Add badge text exactly as: "${textOverlay.badge}".`;

      const result = await generateImage(prompt, originalImage || undefined);
      setResultImage(result);
      trackCreation(); // Track the creation action
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
    trackDownload(); // Track the download action
  };

  const canProceed = () => {
    if (step === "type") return true;
    if (step === "upload") return true; // image is optional for some types
    if (step === "style") return true;
    return true;
  };

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const goPrev = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  // Result view
  if (resultImage) {
    return (
      <div className="min-h-screen pb-24">
        <div className="sticky top-0 z-40 glass-card border-b border-border/40 px-4 py-3">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={() => setResultImage(null)} className="glass-card p-2 rounded-lg hover:scale-105 transition-all"><BackArrow size={18} className="text-foreground" /></button>
              <h1 className="text-base font-bold text-foreground">{isHe ? "התוצאה שלך" : "Your Result"}</h1>
            </div>
            <SparkleIcon size={18} />
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          <div className="glass-card rounded-2xl p-3 animate-fade-in-up">
            <img src={resultImage} alt="Result" className="w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <button onClick={handleDownload} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              <Download size={18} />{isHe ? "הורדה" : "Download"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => { setResultImage(null); handleEnhance(); }} className="flex-1 glass-card py-3 rounded-xl text-sm font-bold text-foreground flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                <RefreshCw size={16} />{isHe ? "גרסה נוספת" : "Another Version"}
              </button>
              <button onClick={() => { setResultImage(null); setStep("type"); }} className="flex-1 glass-card py-3 rounded-xl text-sm font-bold text-foreground flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                <Sparkles size={16} />{isHe ? "התחל מחדש" : "Start Over"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card border-b border-border/40 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/create" className="glass-card p-2 rounded-lg hover:scale-105 transition-all">
              <BackArrow size={18} className="text-foreground" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-foreground">{t("photo.title")}</h1>
              <p className="text-xs text-muted-foreground">{t("photo.subtitle")}</p>
            </div>
          </div>
          <SparkleIcon size={18} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1">
          <div className="h-full gradient-glow rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mb-6">
          <span className={currentStepIndex >= 0 ? "text-primary font-bold" : ""}>{isHe ? "סוג" : "Type"}</span>
          <span className={currentStepIndex >= 1 ? "text-primary font-bold" : ""}>{isHe ? "תמונה" : "Photo"}</span>
          <span className={currentStepIndex >= 2 ? "text-primary font-bold" : ""}>{isHe ? "סגנון" : "Style"}</span>
          <span className={currentStepIndex >= 3 ? "text-primary font-bold" : ""}>{isHe ? "התאמה" : "Customize"}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">

        {/* ═══ Step 1: Type Selection ═══ */}
        {step === "type" && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-lg font-bold text-foreground text-center">{isHe ? "מה תרצה ליצור?" : "What do you want to create?"}</h2>
            <div className="grid grid-cols-2 gap-3">
              {PRODUCT_TYPES.map(pt => {
                const Icon = pt.icon;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setProductType(pt.id)}
                    className={`glass-card rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-[1.03] ${productType === pt.id ? "ring-2 ring-primary glow-shadow" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${productType === pt.id ? "gradient-glow" : "bg-muted"}`}>
                      <Icon size={20} className={productType === pt.id ? "text-primary-foreground" : "text-muted-foreground"} />
                    </div>
                    <span className="text-sm font-bold text-foreground">{isHe ? pt.he : pt.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ Step 2: Upload Image ═══ */}
        {step === "upload" && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-lg font-bold text-foreground text-center">{isHe ? "העלה תמונה" : "Upload Image"}</h2>
            <p className="text-sm text-muted-foreground text-center">{isHe ? "ניתן לדלג ולתת ל-AI ליצור מאפס" : "You can skip and let AI create from scratch"}</p>

            {!originalImage ? (
              <div className="space-y-3">
                <div onClick={() => fileRef.current?.click()} className="h-[160px] rounded-2xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-all group">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 transition-all">
                      <Camera size={20} className="text-muted-foreground" />
                    </div>
                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 transition-all">
                      <ImageIcon size={20} className="text-muted-foreground" />
                    </div>
                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 transition-all">
                      <Upload size={20} className="text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-foreground">{isHe ? "לחצו להעלאת תמונה" : "Click to Upload"}</p>
                    <p className="text-[10px] text-muted-foreground">{isHe ? "תמונה מהטלפון, לוגו או צילום מוצר" : "Phone photo, logo or product shot"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden glass-card p-2">
                <img src={originalImage} alt="Uploaded" className="w-full rounded-xl max-h-[200px] object-contain" />
                <button onClick={() => setOriginalImage(null)} className="absolute top-4 end-4 glass-card p-1.5 rounded-lg hover:scale-110 transition-all">
                  <X size={14} className="text-foreground" />
                </button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>
        )}

        {/* ═══ Step 3: Style ═══ */}
        {step === "style" && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Design style */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-foreground">{isHe ? "סגנון עיצוב" : "Design Style"}</label>
              <div className="grid grid-cols-3 gap-1.5">
                {DESIGN_STYLES.map(s => (
                  <button key={s.id} onClick={() => setDesignStyle(s.id)} className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${designStyle === s.id ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                    {isHe ? s.he : s.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Background color */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Palette size={13} />{isHe ? "צבע רקע" : "Background Color"}
              </label>
              <div className="grid grid-cols-10 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                {BG_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${bgColor === color ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border/30"}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{isHe ? "צבע מותאם:" : "Custom:"}</span>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer border border-border/30" />
                <span className="text-[10px] text-muted-foreground font-mono">{bgColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Step 4: Customize per type ═══ */}
        {step === "customize" && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Logo ideas */}
            {productType === "logo" && (
              <div className="glass-card rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles size={13} />{isHe ? "רעיונות לעיצוב לוגו" : "Logo Design Ideas"}
                </label>
                <div className="space-y-1.5">
                  {LOGO_IDEAS.map((idea, i) => (
                    <button key={i} onClick={() => setSelectedLogoIdea(i)} className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition-all ${selectedLogoIdea === i ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                      {isHe ? idea.he : idea.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Profile poses & body questions */}
            {productType === "profile" && (
              <>
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User size={13} />{isHe ? "תנוחה" : "Pose"}
                  </label>
                  <div className="space-y-1.5">
                    {PROFILE_POSES.map((pose, i) => (
                      <button key={i} onClick={() => setSelectedPose(i)} className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition-all ${selectedPose === i ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {isHe ? pose.he : pose.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={13} />{isHe ? "שדרוג דמות — פרטים לדיוק מירבי" : "Character Details for Best Results"}
                  </label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground">{isHe ? "מבנה גוף" : "Body Type"}</label>
                      <input value={bodyType} onChange={e => setBodyType(e.target.value)} placeholder={isHe ? "לדוגמה: רזה, ממוצע, מלא..." : "e.g. slim, average, full..."} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">{isHe ? "סוג לבוש" : "Clothing Style"}</label>
                      <input value={clothingStyle} onChange={e => setClothingStyle(e.target.value)} placeholder={isHe ? "לדוגמה: חולצה לבנה, חליפה..." : "e.g. white shirt, suit..."} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                    </div>
                    <label className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" checked={headCovering} onChange={e => setHeadCovering(e.target.checked)} className="rounded border-border accent-primary" />
                      <span className="text-sm text-foreground">{isHe ? "לכלול כיסוי ראש" : "Include head covering"}</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Text overlay for product/banner */}
            {(productType === "product" || productType === "story") && (
              <div className="glass-card rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-foreground">{isHe ? "טקסט על התמונה" : "Text Overlay"}</label>
                <p className="text-[10px] text-muted-foreground">{isHe ? "הטקסט יועתק בדיוק כפי שנכתב" : "Text will be copied exactly as written"}</p>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground flex items-center gap-1"><Type size={10} />{isHe ? "שם מוצר" : "Product Name"}</label>
                    <input value={textOverlay.productName} onChange={e => setTextOverlay(p => ({ ...p, productName: e.target.value }))} placeholder={isHe ? "לדוגמה: קרם לחות פנים" : "e.g. Facial Moisturizer"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground flex items-center gap-1"><Tag size={10} />{isHe ? "מחיר" : "Price"}</label>
                    <input value={textOverlay.price} onChange={e => setTextOverlay(p => ({ ...p, price: e.target.value }))} placeholder={isHe ? "לדוגמה: ₪149" : "e.g. $29.99"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground flex items-center gap-1"><Droplet size={10} />{isHe ? "תיאור קצר" : "Description"}</label>
                    <input value={textOverlay.description} onChange={e => setTextOverlay(p => ({ ...p, description: e.target.value }))} placeholder={isHe ? "לדוגמה: 100% טבעי" : "e.g. 100% Natural"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground flex items-center gap-1"><Sparkles size={10} />{isHe ? "תגית" : "Badge"}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(isHe ? ["חדש!", "מבצע", "הנמכר ביותר", "מהדורה מוגבלת"] : ["New!", "Sale", "Best Seller", "Limited"]).map(b => (
                        <button key={b} onClick={() => setTextOverlay(p => ({ ...p, badge: p.badge === b ? "" : b }))} className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${textOverlay.badge === b ? "gradient-glow text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{b}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generate button */}
            <button onClick={handleEnhance} disabled={isProcessing} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
              {isProcessing ? <><Loader2 size={20} className="animate-spin" />{isHe ? "יוצר תמונה..." : "Creating..."}</> : <><Sparkles size={20} />{isHe ? "צור תמונה" : "Create Image"}</>}
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        {step !== "customize" && (
          <div className="flex items-center gap-3 pt-2">
            {currentStepIndex > 0 && (
              <button onClick={goPrev} className="glass-card px-4 py-3 rounded-xl text-sm font-bold text-foreground flex items-center gap-1.5 hover:scale-[1.02] transition-all">
                <PrevArrow size={16} />{isHe ? "חזרה" : "Back"}
              </button>
            )}
            <button onClick={goNext} className="flex-1 gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all">
              {isHe ? "המשך" : "Continue"}<NextArrow size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPhotoStudioPage;
