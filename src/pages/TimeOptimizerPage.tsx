import { useState } from "react";
import { Link } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";
import { useSmartMemory } from "@/hooks/useSmartMemory";
import { generateText } from "@/lib/ai-service";
import {
  ArrowRight, ArrowLeft, Sparkles, Calendar, Clock, AlertTriangle,
  TrendingUp, Battery, Lock, Loader2, Zap, Download, FileText, Trophy,
} from "lucide-react";

const TimeOptimizerPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const { saveEntry, getProgressMessages } = useSmartMemory("time");

  const [weeklyHours, setWeeklyHours] = useState("");
  const [salary, setSalary] = useState("");
  const [servicesList, setServicesList] = useState("");
  const [dataEntered, setDataEntered] = useState(false);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState("");

  const hours = Number(weeklyHours) || 0;
  const salaryNum = Number(salary) || 0;
  const hourlyValue = hours > 0 ? Math.round(salaryNum / hours / 4) : 0;
  const burnout = hours > 45 ? 90 : hours > 35 ? 72 : hours > 25 ? 50 : 30;

  const proFeatures = [t("time.proLoadForecast"), t("time.proServiceSim"), t("time.proProfitDay"), t("time.proPricingRec")];

  const handleStartAnalysis = () => {
    if (hours > 0) {
      saveEntry({ hours, hourlyValue, burnout });
      setDataEntered(true);
    }
  };

  const progressMessages = getProgressMessages({ hours, hourlyValue, burnout }, lang);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const systemPrompt = isHe
        ? "אתה יועץ ניהול זמן לעסקים קטנים. בנה לוח זמנים שבועי מאוזן. הצע חלוקה חכמה שמונעת שחיקה. כתוב בעברית. הדגש מילות מפתח חשובות בתוך סוגריים מרובעים [כך]. חלק את התשובה לנקודות ברורות עם כותרות."
        : "You are a time management consultant for small businesses. Build a balanced weekly schedule. Highlight key words in [brackets]. Structure the answer with clear headings and bullet points.";
      const prompt = isHe
        ? `בנה לי שבוע מאוזן. הנתונים: ${hours} שעות עבודה שבועיות, משכורת/הכנסה ${salaryNum} ₪ לחודש. שירותים: ${servicesList || "כללי"}. תן המלצות מעשיות ומפורטות.`
        : `Build me a balanced week. Data: ${hours} weekly work hours, salary/income ${salaryNum} ₪/month. Services: ${servicesList || "general"}. Give detailed practical recommendations.`;
      const result = await generateText(prompt, systemPrompt);
      setOptimizeResult(result);
    } catch {
      setOptimizeResult(isHe ? "מומלץ לחלק את השבוע ל-3 ימים עמוסים ו-2 ימים קלים." : "Recommended: split into 3 heavy days and 2 light days.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = () => {
    const content = isHe
      ? `דוח ניהול זמן - BizAIra\n${"=".repeat(30)}\n\nשעות עבודה שבועיות: ${hours}\nהכנסה חודשית: ₪${salaryNum.toLocaleString()}\nערך שעתי: ₪${hourlyValue}\nמדד שחיקה: ${burnout}%\nשירותים: ${servicesList || "כללי"}\n\n${optimizeResult ? `המלצת AI:\n${optimizeResult}` : ""}`
      : `Time Management Report - BizAIra\n${"=".repeat(30)}\n\nWeekly Hours: ${hours}\nMonthly Income: ₪${salaryNum.toLocaleString()}\nHourly Value: ₪${hourlyValue}\nBurnout Index: ${burnout}%\nServices: ${servicesList || "general"}\n\n${optimizeResult ? `AI Recommendation:\n${optimizeResult}` : ""}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "time-optimizer-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format result with highlighted keywords
  const renderFormattedResult = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return <span key={i} className="font-bold text-primary bg-primary/10 px-1 rounded">{part.slice(1, -1)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-40 glass-card border-b border-border/40 px-4 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/create" className="glass-card p-2 rounded-lg hover:scale-105 transition-all"><BackArrow size={18} className="text-foreground" /></Link>
            <div><h1 className="text-base font-bold text-foreground">{t("time.title")}</h1><p className="text-xs text-muted-foreground">{t("time.subtitle")}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {dataEntered && (
              <button onClick={handleDownload} className="glass-card px-3 py-2 rounded-lg text-xs font-medium text-foreground flex items-center gap-1.5 hover:scale-105 transition-all">
                <Download size={14} />{isHe ? "הורד דוח" : "Download"}
              </button>
            )}
            <SparkleIcon size={18} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-5">
        {!dataEntered ? (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{isHe ? "הזן את פרטי העבודה שלך" : "Enter Your Work Details"}</h2>
              <p className="text-sm text-muted-foreground mt-1">{isHe ? "המערכת תנתח ותציע אופטימיזציה" : "The system will analyze and suggest optimization"}</p>
            </div>

            <div className="glass-card rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1"><Clock size={12} />{isHe ? "שעות עבודה בשבוע" : "Weekly Work Hours"}</label>
                  <input type="number" value={weeklyHours} onChange={e => setWeeklyHours(e.target.value)} placeholder={isHe ? "לדוגמה: 40" : "e.g. 40"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1"><TrendingUp size={12} />{isHe ? "הכנסה חודשית" : "Monthly Income"}</label>
                  <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder={isHe ? "לדוגמה: 15000" : "e.g. 15000"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1"><Calendar size={12} />{isHe ? "סוגי שירותים / פעילויות" : "Services / Activities"}</label>
                <textarea value={servicesList} onChange={e => setServicesList(e.target.value)} placeholder={isHe ? "לדוגמה: ייעוץ, עיצוב, שיווק..." : "e.g. Consulting, Design, Marketing..."} rows={3} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50" />
              </div>
              <button onClick={handleStartAnalysis} disabled={!weeklyHours} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
                <Sparkles size={18} />{isHe ? "נתח את הזמן שלי" : "Analyze My Time"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in-up">
            {/* Stats cards with better visual hierarchy */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card rounded-2xl p-4 text-center hover:scale-[1.02] transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Clock size={20} className="text-primary" />
                </div>
                <div className="text-2xl font-black text-foreground">{hours}</div>
                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{t("time.weeklyHours")}</div>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center hover:scale-[1.02] transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp size={20} className="text-green-500" />
                </div>
                <div className="text-2xl font-black text-foreground">₪{hourlyValue}</div>
                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{t("time.avgHourlyValue")}</div>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center hover:scale-[1.02] transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${burnout > 70 ? "bg-red-500/10" : burnout > 40 ? "bg-yellow-500/10" : "bg-green-500/10"}`}>
                  <Battery size={20} className={burnout > 70 ? "text-destructive" : burnout > 40 ? "text-yellow-500" : "text-green-500"} />
                </div>
                <div className="text-2xl font-black text-foreground">{burnout}%</div>
                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{t("time.loadIndex")}</div>
              </div>
            </div>

            {/* Progress messages */}
            {progressMessages.length > 0 && (
              <div className="glass-card rounded-xl p-4 space-y-2 border border-primary/20">
                <div className="flex items-center gap-2 mb-1"><Trophy size={14} className="text-primary" /><span className="text-sm font-bold text-foreground">{isHe ? "מעקב התקדמות" : "Progress Tracking"}</span></div>
                {progressMessages.map((msg, i) => (
                  <div key={i} className="bg-primary/5 rounded-lg p-2.5 text-sm text-foreground">{msg}</div>
                ))}
              </div>
            )}

            {/* Burnout bar — cleaner */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap size={14} className={burnout > 70 ? "text-destructive" : "text-primary"} />
                  {isHe ? "מדד עומס שבועי" : "Weekly Load Index"}
                </span>
                <span className={`text-sm font-black px-2 py-0.5 rounded-lg ${burnout > 70 ? "bg-red-500/10 text-destructive" : burnout > 40 ? "bg-yellow-500/10 text-yellow-600" : "bg-green-500/10 text-green-600"}`}>{burnout}%</span>
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${burnout > 70 ? "bg-gradient-to-r from-red-400 to-red-600" : burnout > 40 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : "bg-gradient-to-r from-green-400 to-green-600"}`} style={{ width: `${burnout}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {burnout > 70 ? (isHe ? "⚠️ עומס גבוה — מומלץ לצמצם שעות או לייעל תהליכים" : "⚠️ High load — consider reducing hours or optimizing") : burnout > 40 ? (isHe ? "👍 עומס סביר — יש מקום לאופטימיזציה" : "👍 Reasonable load — room for optimization") : (isHe ? "✅ עומס נמוך — איזון מצוין!" : "✅ Low load — excellent balance!")}
              </p>
            </div>

            {burnout > 70 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-bold text-destructive">{t("time.overloaded")}</p>
                  <p className="text-xs text-destructive/70 mt-0.5 leading-relaxed">{t("time.overloadedDesc")}</p>
                </div>
              </div>
            )}

            {/* Optimize button */}
            <button onClick={handleOptimize} disabled={isOptimizing} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
              {isOptimizing ? <><Loader2 size={20} className="animate-spin" />{isHe ? "בונה שבוע מאוזן..." : "Building balanced week..."}</> : <><Sparkles size={20} />{t("time.buildWeek")}</>}
            </button>

            {optimizeResult && (
              <div className="glass-card rounded-2xl p-5 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl gradient-glow flex items-center justify-center"><Sparkles size={16} className="text-primary-foreground" /></div>
                  <div>
                    <span className="text-sm font-bold text-foreground block">{isHe ? "המלצת AI מותאמת אישית" : "Personalized AI Recommendation"}</span>
                    <span className="text-[10px] text-muted-foreground">{isHe ? "מבוסס על הנתונים שהזנת" : "Based on your data"}</span>
                  </div>
                </div>
                <div className="bg-background/40 rounded-xl p-5 text-sm text-foreground leading-[1.8] whitespace-pre-wrap border border-border/20">
                  {renderFormattedResult(optimizeResult)}
                </div>
              </div>
            )}

            <button onClick={() => setDataEntered(false)} className="w-full glass-card py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-all">
              <FileText size={14} />{isHe ? "ערוך נתונים" : "Edit Data"}
            </button>

            <div className="glass-card rounded-2xl p-4 opacity-70">
              <div className="flex items-center gap-2 mb-2"><Lock size={14} className="text-muted-foreground" /><span className="text-sm font-bold gradient-glow-text">PRO</span></div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">{proFeatures.map(f => <div key={f} className="bg-muted/30 rounded-lg p-2 text-center">{f}</div>)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeOptimizerPage;
