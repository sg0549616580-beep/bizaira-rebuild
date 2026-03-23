import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { generateText } from "@/lib/ai-service";
import SparkleIcon from "@/components/SparkleIcon";
import {
  ArrowRight, ArrowLeft, Sparkles, ChevronLeft, ChevronRight,
  Download, RefreshCw, Plus, Trash2, Type, Palette, Image as ImageIcon,
  FileText, LayoutGrid, Loader2, Upload, Layers, Wand2, Eye,
} from "lucide-react";

// ─── Types ───
interface Slide {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
  layout: "center" | "left-image" | "right-image" | "full-image";
}

type PresentationType = "business" | "service" | "product" | "launch" | "branding" | "investors";
type DesignTheme = "dark-luxury" | "cream" | "white" | "black" | "soft" | "clean" | "rose" | "ocean" | "forest" | "sunset";

const THEMES: Record<DesignTheme, { bg: string; fg: string; accent: string; cardBg: string; label: { he: string; en: string } }> = {
  "dark-luxury": { bg: "bg-[#1a1625]", fg: "text-[#f0e6d3]", accent: "text-[#c9a96e]", cardBg: "linear-gradient(135deg, #1a1625 0%, #2d2140 100%)", label: { he: "יוקרתי כהה", en: "Dark Luxury" } },
  "cream":       { bg: "bg-[#f5f0e8]", fg: "text-[#3d3427]", accent: "text-[#8b6f47]", cardBg: "linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)", label: { he: "שמנת ובז׳", en: "Cream & Beige" } },
  "white":       { bg: "bg-white",      fg: "text-[#1a1a2e]", accent: "text-[#4361ee]", cardBg: "linear-gradient(135deg, #ffffff 0%, #e8ecf8 100%)", label: { he: "מודרני לבן", en: "Modern White" } },
  "black":       { bg: "bg-[#0a0a0a]",  fg: "text-white",      accent: "text-[#e63946]", cardBg: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)", label: { he: "שחור דרמטי", en: "Dramatic Black" } },
  "soft":        { bg: "bg-[#f8f4ff]",  fg: "text-[#2d2b55]", accent: "text-[#7c3aed]", cardBg: "linear-gradient(135deg, #f8f4ff 0%, #ede4ff 100%)", label: { he: "סגול עדין", en: "Soft Purple" } },
  "clean":       { bg: "bg-[#f7f9fc]",  fg: "text-[#1e293b]", accent: "text-[#0ea5e9]", cardBg: "linear-gradient(135deg, #f7f9fc 0%, #dbeafe 100%)", label: { he: "עסקי נקי", en: "Clean Business" } },
  "rose":        { bg: "bg-[#fff0f3]",  fg: "text-[#4a1528]", accent: "text-[#e11d48]", cardBg: "linear-gradient(135deg, #fff0f3 0%, #ffe4e6 100%)", label: { he: "ורוד אלגנטי", en: "Rose Elegant" } },
  "ocean":       { bg: "bg-[#0c1929]",  fg: "text-[#e0f2fe]", accent: "text-[#38bdf8]", cardBg: "linear-gradient(135deg, #0c1929 0%, #0c4a6e 100%)", label: { he: "אוקיינוס", en: "Ocean Deep" } },
  "forest":      { bg: "bg-[#f0f5f0]",  fg: "text-[#1a3a2a]", accent: "text-[#16a34a]", cardBg: "linear-gradient(135deg, #f0f5f0 0%, #dcfce7 100%)", label: { he: "יער ירוק", en: "Forest Green" } },
  "sunset":      { bg: "bg-[#1f1020]",  fg: "text-[#fef3c7]", accent: "text-[#f97316]", cardBg: "linear-gradient(135deg, #1f1020 0%, #431407 100%)", label: { he: "שקיעה", en: "Sunset" } },
};

const PRES_TYPES: { id: PresentationType; he: string; en: string }[] = [
  { id: "business", he: "עסקית כללית", en: "General Business" },
  { id: "service", he: "מצגת שירות", en: "Service" },
  { id: "product", he: "מצגת מוצר", en: "Product" },
  { id: "launch", he: "מצגת השקה", en: "Launch" },
  { id: "branding", he: "מצגת תדמית", en: "Branding" },
  { id: "investors", he: "למשקיעים", en: "Investors" },
];

const LAYOUTS: { id: Slide["layout"]; he: string; en: string }[] = [
  { id: "center", he: "טקסט מרכזי", en: "Center Text" },
  { id: "left-image", he: "תמונה שמאל", en: "Image Left" },
  { id: "right-image", he: "תמונה ימין", en: "Image Right" },
  { id: "full-image", he: "תמונה מלאה", en: "Full Image" },
];

function makeId() { return Math.random().toString(36).slice(2, 9); }

function defaultSlides(lang: "he" | "en"): Slide[] {
  const s = (he: string, en: string) => lang === "he" ? he : en;
  return [
    { id: makeId(), title: s("שקופית פתיחה", "Opening Slide"), subtitle: s("שם העסק שלך", "Your Business Name"), body: s("הפתרון המקצועי שהעסק שלך צריך — חכם, מהיר ואמין.", "The professional solution your business needs — smart, fast and reliable."), layout: "center" },
    { id: makeId(), title: s("מי אנחנו", "About Us"), subtitle: s("הסיפור שלנו", "Our Story"), body: s("אנחנו צוות מקצועי עם ניסיון רב בתחום, שמחויב להביא ערך אמיתי ללקוחות שלנו. הגישה שלנו משלבת חדשנות טכנולוגית עם שירות אישי ומותאם.", "We are a professional team with extensive experience, committed to delivering real value. Our approach combines technological innovation with personalized service."), layout: "center" },
    { id: makeId(), title: s("האתגר", "The Challenge"), subtitle: s("מה הבעיה שאנחנו פותרים", "What problem we solve"), body: s("בעלי עסקים רבים מתמודדים עם חוסר יעילות, עלויות גבוהות וקושי להגיע ללקוחות חדשים. אנחנו מספקים מענה מדויק לאתגרים האלה.", "Many business owners face inefficiency, high costs and difficulty reaching new customers. We provide precise solutions to these challenges."), layout: "left-image" },
    { id: makeId(), title: s("הפתרון שלנו", "Our Solution"), subtitle: s("גישה חכמה לתוצאות טובות יותר", "A smarter approach for better results"), body: s("הפתרון שלנו מבוסס על טכנולוגיה מתקדמת, ניסיון מוכח ומתודולוגיה ייחודית שמאפשרת להשיג תוצאות מדידות בזמן קצר.", "Our solution is based on advanced technology, proven experience and a unique methodology that delivers measurable results quickly."), layout: "right-image" },
    { id: makeId(), title: s("למה לבחור בנו", "Why Choose Us"), subtitle: s("היתרונות שלנו", "Our Advantages"), body: s("מקצועיות ללא פשרות\nשירות אישי ומותאם\nתוצאות מוכחות\nמחירים הוגנים\nליווי צמוד לאורך כל הדרך", "Uncompromising professionalism\nPersonalized service\nProven results\nFair pricing\nClose guidance throughout"), layout: "center" },
    { id: makeId(), title: s("תוצאות ומספרים", "Results & Numbers"), subtitle: s("ההצלחות שלנו מדברות בעד עצמן", "Our success speaks for itself"), body: s("למעלה מ-500 לקוחות מרוצים\nשיפור של 40% ביעילות\n98% שביעות רצון\nנוכחות בשוק מזה 10 שנים", "Over 500 satisfied clients\n40% efficiency improvement\n98% satisfaction rate\n10 years of market presence"), layout: "left-image" },
    { id: makeId(), title: s("בואו נדבר", "Let's Talk"), subtitle: s("צרו קשר עוד היום", "Get in touch today"), body: s("נשמח לשמוע מכם ולהתאים עבורכם את הפתרון המושלם.\nטלפון | אימייל | אתר", "We'd love to hear from you and tailor the perfect solution.\nPhone | Email | Website"), layout: "center" },
  ];
}

// ─── Main Component ───
const PresentationStudioPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const imageRef = useRef<HTMLInputElement>(null);

  const [slides, setSlides] = useState<Slide[]>(() => defaultSlides(lang));
  const [activeIdx, setActiveIdx] = useState(0);
  const [theme, setTheme] = useState<DesignTheme>("dark-luxury");
  const [presType, setPresType] = useState<PresentationType>("business");
  const [businessName, setBusinessName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"structure" | "content" | "style">("structure");

  const activeSlide = slides[activeIdx] || slides[0];
  const themeConfig = THEMES[theme];

  const updateSlide = useCallback((idx: number, patch: Partial<Slide>) => {
    setSlides(prev => prev.map((s, i) => i === idx ? { ...s, ...patch } : s));
  }, []);

  const addSlide = () => {
    const newSlide: Slide = { id: makeId(), title: isHe ? "שקופית חדשה" : "New Slide", subtitle: "", body: "", layout: "center" };
    setSlides(prev => [...prev, newSlide]);
    setActiveIdx(slides.length);
  };

  const removeSlide = (idx: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== idx));
    if (activeIdx >= slides.length - 1) setActiveIdx(Math.max(0, slides.length - 2));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateSlide(activeIdx, { imageUrl: ev.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const systemPrompt = isHe
        ? "אתה מעצב מצגות מקצועי ברמה גבוהה מאוד. צור תוכן מלא, עשיר ומקצועי לכל שקופית בפורמט JSON. כל שקופית חייבת לכלול כותרת חזקה, תת-כותרת משלימה, ותוכן גוף מפורט עם לפחות 2-3 משפטים מלאים. הקפד שהתוכן יהיה עשיר, משכנע ומקצועי גם אם המשתמש נתן מעט פרטים. החזר מערך של אובייקטים עם title, subtitle, body. כתוב בעברית. אל תוסיף טקסט מחוץ ל-JSON."
        : "You are a top-tier professional presentation designer. Create rich, detailed and professional content for each slide in JSON format. Every slide must include a strong title, a complementary subtitle, and detailed body content with at least 2-3 full sentences. Ensure the content is rich, persuasive and professional even if the user provided few details. Return an array of objects with title, subtitle, body. Do not add text outside the JSON.";

      const prompt = isHe
        ? `צור מצגת ${PRES_TYPES.find(p => p.id === presType)?.he || "עסקית"} מקצועית ומרשימה עם ${slides.length} שקופיות${businessName ? ` עבור העסק "${businessName}"` : ""}. כל שקופית חייבת להכיל תוכן מלא ועשיר. החזר JSON בלבד: [{"title":"...","subtitle":"...","body":"..."}]`
        : `Create a professional, impressive ${presType} presentation with ${slides.length} slides${businessName ? ` for the business "${businessName}"` : ""}. Every slide must contain rich, full content. Return JSON only: [{"title":"...","subtitle":"...","body":"..."}]`;

      const result = await generateText(prompt, systemPrompt);
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { title: string; subtitle?: string; body: string }[];
        const layouts: Slide["layout"][] = ["center", "left-image", "right-image", "center", "left-image", "center", "center"];
        setSlides(parsed.map((s, i) => ({ id: makeId(), title: s.title, subtitle: s.subtitle || "", body: s.body, layout: layouts[i % layouts.length] })));
        setActiveIdx(0);
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const content = slides.map((s, i) =>
      `--- ${isHe ? "שקופית" : "Slide"} ${i + 1} ---\n${s.title}\n${s.subtitle ? s.subtitle + "\n" : ""}${s.body}\n`
    ).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presentation-${businessName || "bizaira"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Slide rendering helper
  const renderSlideContent = (slide: Slide, isPreview = false) => {
    const textSize = isPreview ? {
      title: "text-lg md:text-2xl",
      subtitle: "text-sm md:text-base",
      body: "text-xs md:text-sm",
      label: "text-[10px]",
    } : {
      title: "text-[7px]",
      subtitle: "text-[5px]",
      body: "text-[5px]",
      label: "text-[4px]",
    };

    if (slide.layout === "full-image" && slide.imageUrl) {
      return (
        <div className="absolute inset-0">
          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-6">
            <h2 className={`${textSize.title} font-bold text-white`}>{slide.title}</h2>
            {slide.body && <p className={`${textSize.body} text-white/80 mt-1`}>{slide.body}</p>}
          </div>
        </div>
      );
    }

    if ((slide.layout === "left-image" || slide.layout === "right-image") && slide.imageUrl) {
      const imgFirst = slide.layout === "left-image";
      return (
        <div className={`absolute inset-0 flex ${imgFirst ? "flex-row" : "flex-row-reverse"}`}>
          <div className="w-[45%] h-full">
            <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-[55%] flex flex-col justify-center p-3 md:p-6 space-y-1">
            <div className={`w-6 h-0.5 ${themeConfig.accent.replace("text-", "bg-")} opacity-50`} />
            <h2 className={`${textSize.title} font-bold ${themeConfig.fg}`}>{slide.title}</h2>
            {slide.subtitle && <p className={`${textSize.subtitle} ${themeConfig.accent}`}>{slide.subtitle}</p>}
            <p className={`${textSize.body} ${themeConfig.fg} opacity-70 leading-relaxed whitespace-pre-line`}>{slide.body}</p>
          </div>
        </div>
      );
    }

    // Center layout (default)
    const isTitle = activeIdx === 0 && isPreview;
    return (
      <div className={`absolute inset-0 p-3 md:p-8 flex flex-col justify-center ${isTitle ? "text-center items-center" : ""}`}>
        {isTitle && (
          <div className={`${textSize.label} font-medium uppercase tracking-[0.3em] ${themeConfig.accent} opacity-70 mb-3`}>
            {businessName || (isHe ? "שם העסק" : "Business Name")}
          </div>
        )}
        {!isTitle && <div className={`w-8 h-0.5 ${themeConfig.accent.replace("text-", "bg-")} opacity-50 mb-3`} />}
        <h2 className={`${textSize.title} font-bold leading-tight ${themeConfig.fg}`}>{slide.title}</h2>
        {slide.subtitle && <p className={`${textSize.subtitle} ${isTitle ? themeConfig.fg + " opacity-70" : themeConfig.accent} mt-1`}>{slide.subtitle}</p>}
        <p className={`${textSize.body} ${themeConfig.fg} opacity-${isTitle ? "50" : "70"} mt-2 leading-relaxed whitespace-pre-line ${isPreview ? "max-w-[85%]" : ""}`}>{slide.body}</p>
        {slide.imageUrl && (
          <div className={`mt-3 ${isPreview ? "max-w-[120px]" : "max-w-[30px]"} mx-auto`}>
            <img src={slide.imageUrl} alt="" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    );
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
              <h1 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                {t("pres.title")}
              </h1>
              <p className="text-[10px] text-muted-foreground">{t("pres.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="glass-card px-3 py-2 rounded-xl text-xs font-medium text-foreground flex items-center gap-1.5 hover:scale-105 transition-all border border-border/30">
              <Download size={14} />
              {isHe ? "הורדה" : "Download"}
            </button>
            <SparkleIcon size={16} />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-4 pt-4 gap-4">

        {/* ═══ Slide Preview Area ═══ */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Preview label */}
          <div className="flex items-center gap-2 px-1">
            <Eye size={12} className="text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {isHe ? "תצוגה מקדימה" : "Preview"}
            </span>
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-[10px] text-muted-foreground">
              {activeIdx + 1}/{slides.length}
            </span>
          </div>

          {/* Main slide - compact */}
          <div className={`relative rounded-xl overflow-hidden shadow-xl aspect-[16/9] max-h-[200px] ${themeConfig.bg} transition-colors duration-500 border border-border/20`}>
            {renderSlideContent(activeSlide, true)}
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-2">
            <button onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))} disabled={activeIdx === 0} className="glass-card p-1.5 rounded-lg disabled:opacity-30 hover:scale-105 transition-all">
              {isHe ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
            <div className="flex items-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-full transition-all ${i === activeIdx ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"}`}
                />
              ))}
            </div>
            <button onClick={() => setActiveIdx(Math.min(slides.length - 1, activeIdx + 1))} disabled={activeIdx === slides.length - 1} className="glass-card p-1.5 rounded-lg disabled:opacity-30 hover:scale-105 transition-all">
              {isHe ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

          {/* Thumbnails strip */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setActiveIdx(i)}
                className={`relative flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIdx ? "border-primary shadow-md shadow-primary/20 scale-105" : "border-border/20 opacity-50 hover:opacity-80"
                }`}
              >
                <div className={`absolute inset-0 ${themeConfig.bg} flex items-center justify-center p-1`}>
                  {slide.imageUrl && (slide.layout === "full-image" || slide.layout === "left-image" || slide.layout === "right-image") ? (
                    <img src={slide.imageUrl} alt="" className="w-full h-full object-cover opacity-60 absolute inset-0" />
                  ) : null}
                  <span className={`text-[6px] font-bold truncate relative z-10 ${themeConfig.fg}`}>{slide.title}</span>
                </div>
              </button>
            ))}
            <button onClick={addSlide} className="flex-shrink-0 w-20 h-12 rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center hover:border-primary/50 transition-all">
              <Plus size={12} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* ═══ Sidebar Controls ═══ */}
        <div className="lg:w-80 w-full space-y-3">
          {/* Tabs */}
          <div className="flex gap-1 glass-card rounded-xl p-1 border border-border/20">
            {([
              { id: "structure" as const, icon: LayoutGrid, label: isHe ? "מבנה" : "Structure" },
              { id: "content" as const, icon: Type, label: isHe ? "תוכן" : "Content" },
              { id: "style" as const, icon: Palette, label: isHe ? "עיצוב" : "Style" },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setSidebarTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  sidebarTab === tab.id ? "gradient-glow text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Structure tab ─── */}
          {sidebarTab === "structure" && (
            <div className="space-y-3 animate-fade-in">
              {/* Business name */}
              <div className="glass-card rounded-xl p-4 space-y-2.5 border border-border/20">
                <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <FileText size={12} className="text-primary" />
                  {isHe ? "שם העסק" : "Business Name"}
                </label>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder={isHe ? "שם העסק שלך" : "Your business name"} className="w-full bg-background/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>

              {/* Presentation type */}
              <div className="glass-card rounded-xl p-4 space-y-2.5 border border-border/20">
                <label className="text-[11px] font-bold text-foreground">{isHe ? "סוג מצגת" : "Presentation Type"}</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRES_TYPES.map(pt => (
                    <button key={pt.id} onClick={() => setPresType(pt.id)} className={`px-2 py-2 rounded-lg text-[11px] font-medium transition-all ${presType === pt.id ? "gradient-glow text-primary-foreground shadow-sm" : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                      {isHe ? pt.he : pt.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slides list */}
              <div className="glass-card rounded-xl p-4 space-y-2.5 border border-border/20">
                <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <Layers size={12} className="text-primary" />
                  {isHe ? "שקופיות" : "Slides"} 
                  <span className="text-[10px] text-muted-foreground font-normal">({slides.length})</span>
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {slides.map((s, i) => (
                    <div key={s.id} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all group ${i === activeIdx ? "bg-primary/15 text-foreground border border-primary/20" : "text-muted-foreground hover:bg-muted/50"}`} onClick={() => setActiveIdx(i)}>
                      <span className="text-[10px] w-4 text-center opacity-50 font-mono">{i + 1}</span>
                      {s.imageUrl && <ImageIcon size={10} className="text-primary opacity-60" />}
                      <span className="text-[11px] truncate flex-1">{s.title}</span>
                      {slides.length > 1 && (
                        <button onClick={e => { e.stopPropagation(); removeSlide(i); }} className="opacity-0 group-hover:opacity-100 hover:text-destructive p-0.5 transition-opacity">
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addSlide} className="w-full text-[11px] text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-2 border border-dashed border-border/30 rounded-lg hover:border-primary/40 transition-all">
                  <Plus size={11} /> {isHe ? "הוסף שקופית" : "Add Slide"}
                </button>
              </div>

              {/* AI Generate */}
              <button onClick={handleAIGenerate} disabled={isGenerating} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
                {isGenerating ? <><Loader2 size={16} className="animate-spin" />{isHe ? "מייצר תוכן..." : "Generating..."}</> : <><Wand2 size={16} />{isHe ? "צור תוכן עם AI" : "Generate with AI"}</>}
              </button>
            </div>
          )}

          {/* ─── Content tab ─── */}
          {sidebarTab === "content" && (
            <div className="space-y-3 animate-fade-in">
              {/* Slide fields */}
              <div className="glass-card rounded-xl p-4 space-y-3 border border-border/20">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                    <Type size={12} className="text-primary" />
                    {isHe ? "שקופית" : "Slide"} {activeIdx + 1}
                  </label>
                  <span className="text-[9px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{activeSlide.title}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">{isHe ? "כותרת" : "Title"}</label>
                  <input value={activeSlide.title} onChange={e => updateSlide(activeIdx, { title: e.target.value })} placeholder={isHe ? "כותרת השקופית" : "Slide title"} className="w-full bg-background/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">{isHe ? "תת כותרת" : "Subtitle"}</label>
                  <input value={activeSlide.subtitle} onChange={e => updateSlide(activeIdx, { subtitle: e.target.value })} placeholder={isHe ? "תת כותרת (אופציונלי)" : "Subtitle (optional)"} className="w-full bg-background/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">{isHe ? "תוכן" : "Body"}</label>
                  <textarea value={activeSlide.body} onChange={e => updateSlide(activeIdx, { body: e.target.value })} placeholder={isHe ? "התוכן של השקופית..." : "Slide content..."} rows={3} className="w-full bg-background/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
              </div>

              {/* Image upload - compact */}
              <div className="glass-card rounded-xl p-4 space-y-2.5 border border-border/20">
                <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <ImageIcon size={12} className="text-primary" />
                  {isHe ? "תמונה לשקופית" : "Slide Image"}
                </label>
                {activeSlide.imageUrl ? (
                  <div className="relative w-full max-w-[140px] mx-auto">
                    <img src={activeSlide.imageUrl} alt="" className="w-full h-20 object-cover rounded-lg border border-border/30 shadow-sm" />
                    <button onClick={() => updateSlide(activeIdx, { imageUrl: undefined })} className="absolute -top-1.5 -end-1.5 bg-destructive/90 rounded-full p-1 hover:scale-110 transition-all shadow-sm">
                      <Trash2 size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => imageRef.current?.click()} className="w-full border-2 border-dashed border-border/30 rounded-lg py-3 flex flex-col items-center gap-1.5 hover:border-primary/40 transition-all text-muted-foreground hover:text-foreground group">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Upload size={14} />
                    </div>
                    <span className="text-[10px]">{isHe ? "העלה תמונה" : "Upload Image"}</span>
                  </button>
                )}
                <input ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              {/* Layout selection */}
              <div className="glass-card rounded-xl p-4 space-y-2.5 border border-border/20">
                <label className="text-[11px] font-bold text-foreground">{isHe ? "פריסת שקופית" : "Slide Layout"}</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {LAYOUTS.map(l => (
                    <button key={l.id} onClick={() => updateSlide(activeIdx, { layout: l.id })} className={`px-2 py-2 rounded-lg text-[11px] font-medium transition-all ${activeSlide.layout === l.id ? "gradient-glow text-primary-foreground shadow-sm" : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                      {isHe ? l.he : l.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Style tab ─── */}
          {sidebarTab === "style" && (
            <div className="space-y-3 animate-fade-in">
              <div className="glass-card rounded-xl p-4 space-y-3 border border-border/20">
                <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <Palette size={12} className="text-primary" />
                  {isHe ? "סגנון עיצוב" : "Design Theme"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(THEMES) as [DesignTheme, typeof THEMES[DesignTheme]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.03] ${theme === key ? "border-primary shadow-md shadow-primary/20 ring-1 ring-primary/30" : "border-border/20 hover:border-primary/30"}`}
                    >
                      <div className="p-3 space-y-1.5" style={{ background: cfg.cardBg }}>
                        <div className={`h-1 w-8 rounded-full ${cfg.accent.replace("text-", "bg-")} opacity-70`} />
                        <div className={`h-1.5 w-12 rounded-full ${cfg.fg.replace("text-", "bg-")} opacity-80`} />
                        <div className={`h-1 w-10 rounded-full ${cfg.fg.replace("text-", "bg-")} opacity-30`} />
                        <div className={`h-0.5 w-6 rounded-full ${cfg.accent.replace("text-", "bg-")} opacity-40`} />
                      </div>
                      <div className="px-2 py-1.5 bg-card/90 backdrop-blur-sm border-t border-border/10">
                        <span className="text-[10px] font-semibold text-foreground">{isHe ? cfg.label.he : cfg.label.en}</span>
                      </div>
                      {theme === key && (
                        <div className="absolute top-1.5 end-1.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip card */}
              <div className="glass-card rounded-xl p-3 border border-primary/10 bg-primary/5">
                <div className="flex items-start gap-2">
                  <Sparkles size={12} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {isHe ? "בחר סגנון עיצוב שמתאים לעסק שלך. הסגנון ישפיע על הצבעים, הרקע והאווירה של כל שקופית במצגת." : "Choose a design theme that fits your business. The theme affects colors, background and mood of every slide."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationStudioPage;
