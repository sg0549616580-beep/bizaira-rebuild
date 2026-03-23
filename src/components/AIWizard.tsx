import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import SparkleIcon from "@/components/SparkleIcon";
import {
  ArrowRight, ArrowLeft, Sparkles, Upload, X, Download, RefreshCw,
  Copy, Check, ChevronRight, ChevronLeft,
} from "lucide-react";

export interface WizardQuestion {
  id: string;
  question: string;
  type: "select" | "multiselect" | "text" | "textarea" | "upload" | "chips";
  options?: { id: string; label: string; desc?: string }[];
  placeholder?: string;
  maxUploads?: number;
}

export interface WizardConfig {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  questions: WizardQuestion[];
  generateLabel: string;
  generatingLabel: string;
  resultTitle: string;
  resultType: "text" | "preview" | "gallery";
  downloadLabel?: string;
  downloadFormat?: string;
  backRoute?: string;
}

interface Props {
  config: WizardConfig;
  onGenerate?: (answers: Record<string, any>) => Promise<string | string[]> | void;
  mockResult?: string | string[];
  mockDelay?: number;
}

const AIWizard = ({ config, onGenerate, mockResult, mockDelay = 2500 }: Props) => {
  const { t, lang } = useI18n();
  const BackArrow = lang === "he" ? ArrowRight : ArrowLeft;
  const NextArrow = lang === "he" ? ChevronLeft : ChevronRight;
  const PrevArrow = lang === "he" ? ChevronRight : ChevronLeft;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const questions = config.questions;
  const current = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const progress = ((currentStep + 1) / questions.length) * 100;

  const setAnswer = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      if (onGenerate) {
        const res = await onGenerate(answers);
        if (res) {
          setResult(res);
        } else {
          setResult(mockResult || "✨ התוצאה שלך מוכנה!");
        }
      } else {
        // Fallback to mock
        await new Promise(r => setTimeout(r, mockDelay));
        setResult(mockResult || "✨ התוצאה שלך מוכנה!");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "שגיאה ביצירה");
      // Fallback to mock on error
      setResult(mockResult || "✨ התוצאה שלך מוכנה!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (typeof result === "string") {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    if (typeof result === "string" && result.startsWith("data:")) {
      // Base64 image or file - download directly
      const a = document.createElement("a");
      a.href = result;
      const ext = config.downloadFormat || "png";
      a.download = `bizaira-creation.${ext}`;
      a.click();
    } else if (Array.isArray(result)) {
      // Download first image from gallery
      result.forEach((item, i) => {
        if (item.startsWith("data:")) {
          const a = document.createElement("a");
          a.href = item;
          a.download = `bizaira-${i + 1}.png`;
          a.click();
        }
      });
    } else if (typeof result === "string" && !result.startsWith("data:")) {
      // Text result - download as text file
      const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bizaira-creation.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleNewVersion = () => {
    setResult(null);
    setIsGenerating(false);
    setError(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const maxUploads = current?.maxUploads || 1;
    const existing = (answers[current.id] as string[]) || [];
    
    Array.from(files).slice(0, maxUploads - existing.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAnswers(prev => ({
            ...prev,
            [current.id]: [...(prev[current.id] || []), ev.target!.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUpload = (idx: number) => {
    setAnswers(prev => ({
      ...prev,
      [current.id]: (prev[current.id] as string[]).filter((_, i) => i !== idx),
    }));
  };

  // Result screen
  if (result) {
    const isRealImage = typeof result === "string" && result.startsWith("data:image");
    const isRealGallery = Array.isArray(result) && result.length > 0 && result[0].startsWith("data:");

    return (
      <div className="min-h-screen pb-24">
        <Header title={config.title} subtitle={config.subtitle} backRoute={config.backRoute} />
        <div className="max-w-lg mx-auto px-4 pt-8 space-y-6">
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-glow flex items-center justify-center mb-4 glow-shadow">
              <Sparkles size={28} className="text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{config.resultTitle}</h2>
            <p className="text-sm text-muted-foreground">{lang === "he" ? "התוצאה מוכנה — בחר מה לעשות" : "Result is ready — choose what to do"}</p>
          </div>

          {typeof result === "string" && config.resultType === "text" && (
            <div className="glass-card rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="bg-background/50 rounded-lg p-4 whitespace-pre-wrap text-sm text-foreground leading-relaxed border border-border/30">
                {result}
              </div>
            </div>
          )}

          {config.resultType === "preview" && isRealImage && (
            <div className="glass-card rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <img src={result as string} alt="Generated" className="w-full rounded-lg border border-border/30" />
            </div>
          )}

          {config.resultType === "preview" && !isRealImage && (
            <div className="glass-card rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center border border-border/30">
                <div className="text-center space-y-2">
                  {config.icon}
                  <p className="text-xs text-muted-foreground">{lang === "he" ? "תצוגה מקדימה" : "Preview"}</p>
                </div>
              </div>
            </div>
          )}

          {config.resultType === "gallery" && isRealGallery && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              {(result as string[]).map((img, i) => (
                <div key={i} className="glass-card rounded-xl p-2 aspect-square">
                  <img src={img} alt={`Version ${i + 1}`} className="w-full h-full rounded-lg object-cover" />
                </div>
              ))}
            </div>
          )}

          {config.resultType === "gallery" && !isRealGallery && Array.isArray(result) && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              {result.map((img, i) => (
                <div key={i} className="glass-card rounded-xl p-2 aspect-square">
                  <div className="w-full h-full rounded-lg bg-muted flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">{lang === "he" ? `גרסה ${i + 1}` : `Version ${i + 1}`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {config.downloadLabel && (
              <button onClick={handleDownload} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                <Download size={18} />
                {config.downloadLabel}
              </button>
            )}
            {config.resultType === "text" && (
              <button onClick={handleCopy} className="w-full glass-card py-3 rounded-xl text-sm font-bold text-foreground flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                {copied ? <><Check size={16} className="text-green-400" />{lang === "he" ? "הועתק!" : "Copied!"}</> : <><Copy size={16} />{lang === "he" ? "העתק" : "Copy"}</>}
              </button>
            )}
            <button onClick={handleNewVersion} className="w-full glass-card py-3 rounded-xl text-sm font-bold text-foreground flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              <RefreshCw size={16} />
              {lang === "he" ? "צור גרסה נוספת" : "Create Another Version"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header title={config.title} subtitle={config.subtitle} backRoute={config.backRoute} />

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {currentStep + 1} / {questions.length}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-glow rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in-up" key={current.id}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl gradient-glow flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{current.question}</h2>
            </div>
          </div>

          {/* Select */}
          {current.type === "select" && current.options && (
            <div className="grid grid-cols-2 gap-2">
              {current.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAnswer(current.id, opt.id)}
                  className={`p-3 rounded-xl text-start transition-all ${
                    answers[current.id] === opt.id
                      ? "gradient-glow text-primary-foreground glow-shadow"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="text-sm font-bold">{opt.label}</div>
                  {opt.desc && (
                    <div className={`text-xs mt-0.5 ${answers[current.id] === opt.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {opt.desc}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Chips */}
          {current.type === "chips" && current.options && (
            <div className="flex flex-wrap gap-2">
              {current.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAnswer(current.id, opt.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    answers[current.id] === opt.id
                      ? "gradient-glow text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Text */}
          {current.type === "text" && (
            <input
              value={answers[current.id] || ""}
              onChange={e => setAnswer(current.id, e.target.value)}
              placeholder={current.placeholder}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          )}

          {/* Textarea */}
          {current.type === "textarea" && (
            <textarea
              value={answers[current.id] || ""}
              onChange={e => setAnswer(current.id, e.target.value)}
              placeholder={current.placeholder}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-28 focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          )}

          {/* Upload */}
          {current.type === "upload" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {((answers[current.id] as string[]) || []).map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border/50">
                    <img src={img} alt={`upload ${idx}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeUpload(idx)} className="absolute top-1.5 start-1.5 bg-black/60 backdrop-blur p-1 rounded-full">
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
                {((answers[current.id] as string[]) || []).length < (current.maxUploads || 1) && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-all"
                  >
                    <Upload size={22} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{lang === "he" ? "העלאה" : "Upload"}</span>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="glass-card px-4 py-3 rounded-xl text-sm font-bold text-foreground flex items-center gap-1.5 hover:scale-[1.02] transition-all"
            >
              <PrevArrow size={16} />
              {lang === "he" ? "הקודם" : "Back"}
            </button>
          )}
          
          {!isLastStep ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex-1 gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
            >
              {lang === "he" ? "המשך" : "Continue"}
              <NextArrow size={16} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 animate-glow-pulse"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {config.generatingLabel}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {config.generateLabel}
                </>
              )}
            </button>
          )}
        </div>

        {/* Skip hint */}
        {!isLastStep && (
          <p className="text-center text-xs text-muted-foreground">
            {lang === "he" ? "אפשר לדלג — AI ישלים את החסר" : "You can skip — AI will fill in the blanks"}
          </p>
        )}
      </div>
    </div>
  );
};

function Header({ title, subtitle, backRoute }: { title: string; subtitle: string; backRoute?: string }) {
  const { lang } = useI18n();
  const BackArrow = lang === "he" ? ArrowRight : ArrowLeft;

  return (
    <div className="sticky top-0 z-40 glass-card border-b border-border/40 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <Link to={backRoute || "/create"} className="glass-card p-2 rounded-lg hover:scale-105 transition-all">
            <BackArrow size={18} className="text-foreground" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <SparkleIcon size={18} />
      </div>
    </div>
  );
}

export default AIWizard;
