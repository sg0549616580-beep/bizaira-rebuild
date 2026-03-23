import { useState } from "react";
import { Link } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";
import { useSmartMemory } from "@/hooks/useSmartMemory";
import { generateText } from "@/lib/ai-service";
import {
  ArrowRight, ArrowLeft, Sparkles, DollarSign, Clock, TrendingUp,
  AlertTriangle, Lock, Calculator, Loader2, Zap, Package, Download, Trophy,
} from "lucide-react";

const PricingStrategistPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const { saveEntry, getProgressMessages } = useSmartMemory("pricing");

  const [serviceDuration, setServiceDuration] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [fixedExpenses, setFixedExpenses] = useState("");
  const [desiredProfit, setDesiredProfit] = useState("40");
  const [calculated, setCalculated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState("");

  const duration = Number(serviceDuration) || 60;
  const material = Number(materialCost) || 0;
  const prep = Number(prepTime) || 0;
  const fixed = Number(fixedExpenses) || 0;
  const profitPct = Number(desiredProfit) || 30;
  const totalHours = (duration + prep) / 60;
  const hourlyFixed = fixed / 160;
  const baseCost = material + (hourlyFixed * totalHours);
  const minPrice = Math.round(baseCost * 1.15);
  const recommendedPrice = Math.round(baseCost * (1 + profitPct / 100));
  const premiumPrice = Math.round(recommendedPrice * 1.35);
  const hourlyValue = Math.round(recommendedPrice / totalHours);

  const proFeatures = [t("pricing.proCompetitors"), t("pricing.proSimulations"), t("pricing.proPsychology"), t("pricing.proPositioning")];

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const systemPrompt = isHe
        ? "אתה יועץ תמחור עסקי. ענה בעברית בצורה קצרה וברורה."
        : "You are a business pricing consultant. Answer briefly.";
      const prompt = isHe
        ? `נתונים: מחיר מומלץ ₪${recommendedPrice}, משך ${duration} דקות, חומרים ₪${material}, הוצאות ₪${fixed}/חודש. מה יקרה אם אעלה ב-10%? אם אוריד ב-15%? תן 3 המלצות.`
        : `Data: price ₪${recommendedPrice}, ${duration}min, materials ₪${material}, fixed ₪${fixed}/mo. What if +10%? -15%? Give 3 recommendations.`;
      const result = await generateText(prompt, systemPrompt);
      setSimResult(result);
    } catch {
      setSimResult(isHe ? "העלאת מחיר ב-10% מומלצת. הורדה ב-15% לא כדאית." : "10% increase recommended. 15% decrease not advisable.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDownload = () => {
    const content = isHe
      ? `דוח תמחור - BizAIra\n${"=".repeat(30)}\n\nמשך שירות: ${duration} דקות\nעלות חומרים: ₪${material}\nזמן הכנה: ${prep} דקות\nהוצאות קבועות: ₪${fixed}/חודש\nרווח רצוי: ${profitPct}%\n\nמחיר מינימלי: ₪${minPrice}\nמחיר מומלץ: ₪${recommendedPrice}\nמחיר פרימיום: ₪${premiumPrice}\nערך שעתי: ₪${hourlyValue}/שעה\n\n${simResult ? `סימולציה:\n${simResult}` : ""}`
      : `Pricing Report - BizAIra\n${"=".repeat(30)}\n\nDuration: ${duration}min\nMaterials: ₪${material}\nPrep: ${prep}min\nFixed: ₪${fixed}/mo\nDesired Profit: ${profitPct}%\n\nMin Price: ₪${minPrice}\nRecommended: ₪${recommendedPrice}\nPremium: ₪${premiumPrice}\nHourly: ₪${hourlyValue}/hr\n\n${simResult ? `Simulation:\n${simResult}` : ""}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pricing-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-40 glass-card border-b border-border/40 px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/create" className="glass-card p-2 rounded-lg hover:scale-105 transition-all"><BackArrow size={18} className="text-foreground" /></Link>
            <div><h1 className="text-base font-bold text-foreground">{t("pricing.stTitle")}</h1><p className="text-xs text-muted-foreground">{t("pricing.stSubtitle")}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {calculated && (
              <button onClick={handleDownload} className="glass-card px-3 py-2 rounded-lg text-xs font-medium text-foreground flex items-center gap-1.5 hover:scale-105 transition-all">
                <Download size={14} />{isHe ? "הורד דוח" : "Download"}
              </button>
            )}
            <SparkleIcon size={18} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-5">
        <div className="glass-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1"><Calculator size={16} className="text-foreground" /><span className="text-sm font-bold text-foreground">{t("pricing.calculator")}</span></div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("pricing.duration")} icon={<Clock size={12} />} value={serviceDuration} onChange={setServiceDuration} suffix={isHe ? "דק׳" : "min"} placeholder={isHe ? "לדוגמה: 60" : "e.g. 60"} />
            <Field label={t("pricing.materials")} icon={<DollarSign size={12} />} value={materialCost} onChange={setMaterialCost} suffix="₪" placeholder={isHe ? "לדוגמה: 50" : "e.g. 50"} />
            <Field label={t("pricing.prepTime")} icon={<Clock size={12} />} value={prepTime} onChange={setPrepTime} suffix={isHe ? "דק׳" : "min"} placeholder={isHe ? "לדוגמה: 30" : "e.g. 30"} />
            <Field label={t("pricing.fixedExpenses")} icon={<DollarSign size={12} />} value={fixedExpenses} onChange={setFixedExpenses} suffix="₪" placeholder={isHe ? "לדוגמה: 3000" : "e.g. 3000"} />
          </div>
          <div>
             <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1"><TrendingUp size={12} />{isHe ? "יעד רווחיות" : "Profitability Target"}</span>
              <span className="gradient-glow-text font-black">{desiredProfit}%</span>
            </label>
            <input type="range" min="10" max="100" value={desiredProfit} onChange={e => setDesiredProfit(e.target.value)} className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
          </div>
        </div>

        <button onClick={() => { saveEntry({ recommendedPrice, hourlyValue, minPrice, premiumPrice }); setCalculated(true); }} disabled={!serviceDuration} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"><Sparkles size={22} />{t("pricing.calculate")}</button>

        {calculated && (
          <div className="animate-fade-in-up space-y-4">
            {getProgressMessages({ recommendedPrice, hourlyValue }, lang).length > 0 && (
              <div className="glass-card rounded-xl p-4 space-y-2 border border-primary/20">
                <div className="flex items-center gap-2 mb-1"><Trophy size={14} className="text-primary" /><span className="text-sm font-bold text-foreground">{isHe ? "מעקב התקדמות" : "Progress Tracking"}</span></div>
                {getProgressMessages({ recommendedPrice, hourlyValue }, lang).map((msg, i) => (
                  <div key={i} className="bg-primary/5 rounded-lg p-2.5 text-sm text-foreground">{msg}</div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <PriceCard label={t("pricing.minPrice")} price={minPrice} sublabel={t("pricing.notRecommended")} variant="warning" />
              <PriceCard label={t("pricing.recommended")} price={recommendedPrice} sublabel={t("pricing.recommendedLabel")} variant="primary" />
              <PriceCard label={t("pricing.premium")} price={premiumPrice} sublabel={t("pricing.highPositioning")} variant="gold" />
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5"><Zap size={14} className="text-primary" />{t("pricing.hourlyValue")}</span>
                <span className="text-lg font-black gradient-glow-text">₪{hourlyValue}/{isHe ? "שעה" : "hr"}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-glow rounded-full transition-all duration-700" style={{ width: `${Math.min(hourlyValue / 8, 100)}%` }} />
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2"><SparkleIcon size={14} /><span className="text-sm font-bold text-foreground">{t("pricing.insights")}</span></div>
              {minPrice < 100 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5" />
                  <p className="text-xs text-red-600">{isHe ? "המחיר המינימלי נמוך מאוד." : "Minimum price is very low."}</p>
                </div>
              )}
              <div className="bg-background/40 rounded-lg p-3 text-sm text-foreground border border-border/20">
                <TrendingUp size={12} className="inline text-green-500 mr-1" />
                {isHe ? `העלאה של 10% (ל-₪${Math.round(recommendedPrice * 1.1)}) תגדיל רווח ב-₪${Math.round(recommendedPrice * 0.1 * 20)}/חודש.` : `10% increase (to ₪${Math.round(recommendedPrice * 1.1)}) would boost profit by ₪${Math.round(recommendedPrice * 0.1 * 20)}/month.`}
              </div>
              <div className="bg-background/40 rounded-lg p-3 text-sm text-foreground border border-border/20">
                <Package size={12} className="inline text-blue-500 mr-1" />
                {isHe ? `חבילה של 3 ב-₪${Math.round(recommendedPrice * 2.7)} במקום ₪${recommendedPrice * 3}.` : `Bundle 3 at ₪${Math.round(recommendedPrice * 2.7)} vs ₪${recommendedPrice * 3}.`}
              </div>
            </div>

            <button onClick={handleSimulate} disabled={isSimulating} className="w-full glass-card py-3.5 rounded-xl text-sm font-bold text-foreground flex items-center justify-center gap-2 hover:scale-[1.02] transition-all border border-primary/20 disabled:opacity-50">
              {isSimulating ? <><Loader2 size={16} className="animate-spin" />{isHe ? "מריץ סימולציה..." : "Running..."}</> : <><Sparkles size={16} className="text-primary" />{isHe ? "הרץ סימולציית AI" : "Run AI Simulation"}</>}
            </button>

            {simResult && (
              <div className="glass-card rounded-xl p-4 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg gradient-glow flex items-center justify-center"><Sparkles size={12} className="text-primary-foreground" /></div>
                  <span className="text-sm font-bold text-foreground">{isHe ? "תוצאות סימולציה" : "Simulation Results"}</span>
                </div>
                <div className="bg-background/40 rounded-lg p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap border border-border/30">{simResult}</div>
              </div>
            )}

            <div className="glass-card rounded-xl p-4 opacity-70">
              <div className="flex items-center gap-2 mb-2"><Lock size={14} className="text-muted-foreground" /><span className="text-sm font-bold gradient-glow-text">PRO</span></div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">{proFeatures.map(f => <div key={f} className="bg-muted/30 rounded-lg p-2 text-center">{f}</div>)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Field({ label, icon, value, onChange, suffix, placeholder }: { label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; suffix?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">{icon}{label}</label>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
        {suffix && <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function PriceCard({ label, price, sublabel, variant }: { label: string; price: number; sublabel: string; variant: "warning" | "primary" | "gold" }) {
  const styles = {
    warning: { card: "glass-card", price: "text-red-500", sub: "text-muted-foreground" },
    primary: { card: "glass-card ring-2 ring-primary glow-shadow", price: "gradient-glow-text", sub: "text-green-500 font-bold" },
    gold: { card: "glass-card", price: "text-yellow-600", sub: "text-muted-foreground" },
  };
  const s = styles[variant];
  return (
    <div className={`${s.card} rounded-xl p-4 text-center`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-xl font-black ${s.price}`}>₪{price}</div>
      <div className={`text-[10px] ${s.sub} mt-0.5`}>{sublabel}</div>
    </div>
  );
}

export default PricingStrategistPage;
