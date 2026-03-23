import { useState } from "react";
import { Link } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";
import { useSmartMemory } from "@/hooks/useSmartMemory";
import {
  ArrowRight, ArrowLeft, TrendingUp, TrendingDown, DollarSign,
  Users, Target, MessageSquare, BarChart3, Lock, Sparkles, Loader2,
  PieChart, Download, FileText, Heart, HelpCircle, Trophy,
} from "lucide-react";
import { generateText } from "@/lib/ai-service";

const MONTHS_HE = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BusinessAnalyticsPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const currency = "₪";
  const { saveEntry, getProgressMessages, history } = useSmartMemory("analytics");

  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [newClientsCount, setNewClientsCount] = useState("");
  const [dataEntered, setDataEntered] = useState(false);

  // Personal questions
  const [feeling, setFeeling] = useState("");
  const [tooMuchTime, setTooMuchTime] = useState("");
  const [wantToImprove, setWantToImprove] = useState("");

  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "monthly" | "ask">("overview");

  const revenue = Number(monthlyRevenue) || 0;
  const expenses = Number(monthlyExpenses) || 0;
  const profit = revenue - expenses;
  const profitMargin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
  const clients = Number(newClientsCount) || 0;

  // Simulate monthly data for table
  const currentMonth = new Date().getMonth();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (currentMonth - 5 + i + 12) % 12;
    const factor = 0.7 + (i * 0.08) + Math.random() * 0.15;
    return {
      month: isHe ? MONTHS_HE[monthIdx] : MONTHS_EN[monthIdx],
      revenue: Math.round(revenue * factor),
      expenses: Math.round(expenses * (0.85 + Math.random() * 0.2)),
      clients: Math.round(clients * factor),
      growth: i === 0 ? 0 : Math.round((factor - (0.7 + ((i - 1) * 0.08))) * 100),
    };
  });

  const handleStartAnalysis = () => {
    if (revenue > 0) {
      saveEntry({ revenue, profit, clients, profitMargin });
      setDataEntered(true);
    }
  };

  const progressMessages = getProgressMessages({ revenue, profit, clients, profitMargin }, lang);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsAsking(true);
    try {
      const personalContext = feeling || tooMuchTime || wantToImprove
        ? `\nהרגשה כללית: ${feeling || "לא צוין"}. האם העסק לוקח יותר מדי זמן: ${tooMuchTime || "לא צוין"}. מה רוצה לשפר: ${wantToImprove || "לא צוין"}.`
        : "";
      const systemPrompt = isHe
        ? `אתה יועץ עסקי חכם. ענה בעברית בצורה קצרה, ברורה ומנומקת. התבסס על הנתונים: הכנסות חודשיות ${currency}${revenue.toLocaleString()}, הוצאות ${currency}${expenses.toLocaleString()}, רווח נקי ${currency}${profit.toLocaleString()}, ${clients} לקוחות חדשים.${personalContext}`
        : `You are a smart business advisor. Answer briefly with reasoning. Data: monthly revenue ${currency}${revenue.toLocaleString()}, expenses ${currency}${expenses.toLocaleString()}, net profit ${currency}${profit.toLocaleString()}, ${clients} new clients.`;
      const answer = await generateText(question, systemPrompt);
      setAiAnswer(answer);
    } catch {
      setAiAnswer(isHe ? "לא הצלחתי לייצר תשובה. נסה שוב." : "Could not generate answer. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleDownloadReport = () => {
    const content = isHe
      ? `דוח ניתוח עסקי - BizAIra\n${"=".repeat(30)}\n\nהכנסות חודשיות: ${currency}${revenue.toLocaleString()}\nהוצאות חודשיות: ${currency}${expenses.toLocaleString()}\nרווח נקי: ${currency}${profit.toLocaleString()}\nמרווח רווח: ${profitMargin}%\nלקוחות חדשים: ${clients}\n\n${aiAnswer ? `תשובת AI:\n${aiAnswer}` : ""}`
      : `Business Analytics Report - BizAIra\n${"=".repeat(30)}\n\nMonthly Revenue: ${currency}${revenue.toLocaleString()}\nMonthly Expenses: ${currency}${expenses.toLocaleString()}\nNet Profit: ${currency}${profit.toLocaleString()}\nProfit Margin: ${profitMargin}%\nNew Clients: ${clients}\n\n${aiAnswer ? `AI Answer:\n${aiAnswer}` : ""}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-analytics-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const proFeatures = [t("analytics.forecast"), t("analytics.simulations"), t("analytics.multiYear"), t("analytics.breakeven")];

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-40 glass-card border-b border-border/40 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/create" className="glass-card p-2 rounded-lg hover:scale-105 transition-all"><BackArrow size={18} className="text-foreground" /></Link>
            <div><h1 className="text-base font-bold text-foreground">{t("analytics.title")}</h1><p className="text-xs text-muted-foreground">{t("analytics.subtitle")}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {dataEntered && (
              <button onClick={handleDownloadReport} className="glass-card px-3 py-2 rounded-lg text-xs font-medium text-foreground flex items-center gap-1.5 hover:scale-105 transition-all">
                <Download size={14} />{isHe ? "הורד דוח" : "Download"}
              </button>
            )}
            <SparkleIcon size={18} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-5">

        {!dataEntered ? (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={28} className="text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{isHe ? "הזן את נתוני העסק שלך" : "Enter Your Business Data"}</h2>
              <p className="text-sm text-muted-foreground mt-1">{isHe ? "המערכת תחשב ותציג תוצאות אוטומטית" : "The system will automatically calculate and display results"}</p>
            </div>

            {/* Business data */}
            <div className="glass-card rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1"><DollarSign size={12} />{isHe ? "הכנסות חודשיות" : "Monthly Revenue"}</label>
                  <input type="number" value={monthlyRevenue} onChange={e => setMonthlyRevenue(e.target.value)} placeholder={isHe ? "לדוגמה: 25000" : "e.g. 25000"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1"><TrendingDown size={12} />{isHe ? "הוצאות חודשיות" : "Monthly Expenses"}</label>
                  <input type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(e.target.value)} placeholder={isHe ? "לדוגמה: 8000" : "e.g. 8000"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1"><Users size={12} />{isHe ? "לקוחות חדשים החודש" : "New Clients This Month"}</label>
                  <input type="number" value={newClientsCount} onChange={e => setNewClientsCount(e.target.value)} placeholder={isHe ? "לדוגמה: 14" : "e.g. 14"} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                </div>
              </div>
            </div>

            {/* Personal questions */}
            <div className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart size={14} className="text-accent" />
                <span className="text-sm font-bold text-foreground">{isHe ? "שאלות אישיות על העסק" : "Personal Business Questions"}</span>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <HelpCircle size={10} />{isHe ? "איך את/ה מרגיש/ה לגבי העסק?" : "How do you feel about your business?"}
                </label>
                <input value={feeling} onChange={e => setFeeling(e.target.value)} placeholder={isHe ? "לדוגמה: מרגישה שיש פוטנציאל אבל חסר מיקוד..." : "e.g. I feel there's potential but lack focus..."} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <HelpCircle size={10} />{isHe ? "האם העסק לוקח לך יותר מדי זמן?" : "Does the business take too much of your time?"}
                </label>
                <input value={tooMuchTime} onChange={e => setTooMuchTime(e.target.value)} placeholder={isHe ? "לדוגמה: כן, עובדת 12 שעות ביום..." : "e.g. Yes, working 12 hours a day..."} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <HelpCircle size={10} />{isHe ? "מה את/ה רוצה לשפר?" : "What do you want to improve?"}
                </label>
                <input value={wantToImprove} onChange={e => setWantToImprove(e.target.value)} placeholder={isHe ? "לדוגמה: להגדיל הכנסות, לפנות זמן..." : "e.g. Increase revenue, free up time..."} className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
              </div>
            </div>

            <button onClick={handleStartAnalysis} disabled={!monthlyRevenue} className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
              <Sparkles size={18} />{isHe ? "נתח את העסק שלי" : "Analyze My Business"}
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in-up">
            {/* Metrics — no "close rate" */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: isHe ? "הכנסות" : "Revenue", value: `${currency}${revenue.toLocaleString()}`, icon: DollarSign, up: true },
                { label: isHe ? "רווח נקי" : "Net Profit", value: `${currency}${profit.toLocaleString()}`, icon: TrendingUp, up: profit > 0 },
                { label: isHe ? "לקוחות חדשים" : "New Clients", value: `${clients}`, icon: Users, up: true },
              ].map(m => (
                <div key={m.label} className="glass-card rounded-xl p-4 hover:scale-[1.02] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><m.icon size={16} className="text-muted-foreground" /></div>
                    {m.up ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-destructive" />}
                  </div>
                  <div className="text-xl font-black text-foreground">{m.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                </div>
              ))}
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


            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">{isHe ? "מרווח רווח" : "Profit Margin"}</span>
                <span className={`text-lg font-black ${profitMargin >= 30 ? "text-green-500" : profitMargin >= 15 ? "text-yellow-500" : "text-destructive"}`}>{profitMargin}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${profitMargin >= 30 ? "bg-green-500" : profitMargin >= 15 ? "bg-yellow-500" : "bg-destructive"}`} style={{ width: `${Math.min(profitMargin, 100)}%` }} />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 glass-card rounded-xl p-1">
              {([
                { id: "overview" as const, icon: PieChart, label: isHe ? "תובנות" : "Insights" },
                { id: "monthly" as const, icon: BarChart3, label: isHe ? "חודשי" : "Monthly" },
                { id: "ask" as const, icon: MessageSquare, label: isHe ? "שאל AI" : "Ask AI" },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? "gradient-glow text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <tab.icon size={14} />{tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4"><SparkleIcon size={14} /><span className="text-sm font-bold text-foreground">{isHe ? "תובנות אוטומטיות" : "Auto Insights"}</span></div>
                  <div className="space-y-2">
                    {(profitMargin >= 30
                      ? [isHe ? `מרווח הרווח שלך (${profitMargin}%) מצוין — עסק בריא!` : `Your profit margin (${profitMargin}%) is excellent — healthy business!`]
                      : [isHe ? `מרווח הרווח שלך (${profitMargin}%) נמוך — שווה לבדוק אפשרויות הפחתת הוצאות.` : `Your profit margin (${profitMargin}%) is low — consider reducing expenses.`]
                    ).concat(
                      clients > 10 ? [isHe ? `${clients} לקוחות חדשים — צמיחה חזקה!` : `${clients} new clients — strong growth!`] : [isHe ? `${clients} לקוחות חדשים — שווה להשקיע בשיווק.` : `${clients} new clients — worth investing in marketing.`],
                    ).map((text, i) => (
                      <div key={i} className="rounded-lg p-3 border border-border/30 bg-background/40">
                        <p className="text-sm text-foreground leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setDataEntered(false)} className="w-full glass-card py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-all">
                  <FileText size={14} />{isHe ? "ערוך נתונים" : "Edit Data"}
                </button>
              </div>
            )}

            {/* Monthly table */}
            {activeTab === "monthly" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="glass-card rounded-xl p-4 overflow-x-auto">
                  <div className="flex items-center gap-2 mb-4"><BarChart3 size={14} className="text-primary" /><span className="text-sm font-bold text-foreground">{isHe ? "טבלה חודשית" : "Monthly Table"}</span></div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-start py-2 px-2 text-xs font-bold text-muted-foreground">{isHe ? "חודש" : "Month"}</th>
                        <th className="text-start py-2 px-2 text-xs font-bold text-muted-foreground">{isHe ? "הכנסות" : "Revenue"}</th>
                        <th className="text-start py-2 px-2 text-xs font-bold text-muted-foreground">{isHe ? "הוצאות" : "Expenses"}</th>
                        <th className="text-start py-2 px-2 text-xs font-bold text-muted-foreground">{isHe ? "לקוחות" : "Clients"}</th>
                        <th className="text-start py-2 px-2 text-xs font-bold text-muted-foreground">{isHe ? "שינוי" : "Change"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((row, i) => {
                        const rowProfit = row.revenue - row.expenses;
                        const isPositive = rowProfit > 0;
                        return (
                          <tr key={i} className={`border-b border-border/10 transition-colors ${i === monthlyData.length - 1 ? "bg-primary/5 font-bold" : "hover:bg-muted/30"}`}>
                            <td className="py-2.5 px-2 text-foreground font-semibold">{row.month}</td>
                            <td className="py-2.5 px-2">
                              <span className={isPositive ? "text-green-600" : "text-destructive"}>{currency}{row.revenue.toLocaleString()}</span>
                            </td>
                            <td className="py-2.5 px-2 text-muted-foreground">{currency}{row.expenses.toLocaleString()}</td>
                            <td className="py-2.5 px-2 text-foreground">{row.clients}</td>
                            <td className="py-2.5 px-2">
                              {row.growth !== 0 && (
                                <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${row.growth > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-destructive"}`}>
                                  {row.growth > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                  {row.growth > 0 ? "+" : ""}{row.growth}%
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "ask" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg gradient-glow flex items-center justify-center"><Sparkles size={14} className="text-primary-foreground" /></div>
                    <span className="text-sm font-bold text-foreground">{t("analytics.askAi")}</span>
                  </div>
                  <div className="flex gap-2">
                    <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAsk()} placeholder={t("analytics.askPh")} className="flex-1 bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
                    <button onClick={handleAsk} disabled={isAsking || !question.trim()} className="gradient-glow px-4 rounded-lg text-primary-foreground font-bold text-sm disabled:opacity-50 flex items-center gap-1.5">
                      {isAsking ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {t("analytics.ask")}
                    </button>
                  </div>
                  {aiAnswer && (
                    <div className="mt-4 bg-background/40 rounded-xl p-4 border border-border/30 animate-fade-in-up">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
                    </div>
                  )}
                  <div className="mt-4 space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isHe ? "שאלות מוצעות" : "Suggested"}</label>
                    {(isHe ? ["איך אני מגדיל/ה רווח?", "מה הכי כדאי לשפר?", "איפה אני יכול/ה לחסוך?"] : ["How can I increase profit?", "What should I improve?", "Where can I save?"]).map(q => (
                      <button key={q} onClick={() => setQuestion(q)} className="w-full text-start bg-muted/40 hover:bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-all">{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PRO */}
            <div className="glass-card rounded-xl p-4 opacity-70">
              <div className="flex items-center gap-2 mb-2"><Lock size={14} className="text-muted-foreground" /><span className="text-sm font-bold gradient-glow-text">{t("analytics.proFeatures")}</span></div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">{proFeatures.map(f => <div key={f} className="bg-muted/30 rounded-lg p-2 text-center">{f}</div>)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessAnalyticsPage;
