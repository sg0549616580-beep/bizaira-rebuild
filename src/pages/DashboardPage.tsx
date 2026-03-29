import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wand2, CreditCard, HeadphonesIcon, Calendar, TrendingUp, ChevronRight, ChevronLeft, Sparkles, Download, PenTool } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

// Local storage keys for activity tracking
const STORAGE_KEYS = {
  firstUseDate: "bizaira_first_credit_use",
  creationsCount: "bizaira_creations_count",
  downloadsCount: "bizaira_downloads_count",
};

const DashboardPage = () => {
  const { t, lang } = useI18n();
  const { user, profile } = useAuth();
  const isHe = lang === "he";

  const userName = user?.user_metadata?.full_name || (isHe ? "אורח" : "Guest");
  const creditsUsed = profile?.credits_used ?? 0;
  const creditsTotal = profile?.credits_total ?? 5;
  const creditsLeft = creditsTotal - creditsUsed;
  const creditPct = creditsTotal > 0 ? Math.round((creditsLeft / creditsTotal) * 100) : 0;
  
  // Get first credit use date and calculate next renewal (1 month after first use)
  const [firstUseDate, setFirstUseDate] = useState<string | null>(null);
  const [creationsCount, setCreationsCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);

  useEffect(() => {
    // Load activity stats from localStorage
    const storedFirstUse = localStorage.getItem(STORAGE_KEYS.firstUseDate);
    const storedCreations = localStorage.getItem(STORAGE_KEYS.creationsCount);
    const storedDownloads = localStorage.getItem(STORAGE_KEYS.downloadsCount);
    
    if (storedFirstUse) setFirstUseDate(storedFirstUse);
    if (storedCreations) setCreationsCount(parseInt(storedCreations, 10) || 0);
    if (storedDownloads) setDownloadsCount(parseInt(storedDownloads, 10) || 0);
  }, []);

  // Calculate next renewal date (1 month after first use)
  const getNextRenewalDate = () => {
    if (!firstUseDate) return isHe ? "טרם נעשה שימוש" : "No usage yet";
    const first = new Date(firstUseDate);
    const nextRenewal = new Date(first);
    nextRenewal.setMonth(nextRenewal.getMonth() + 1);
    return nextRenewal.toLocaleDateString(isHe ? "he-IL" : "en-US");
  };

  const formatFirstUseDate = () => {
    if (!firstUseDate) return isHe ? "טרם נעשה שימוש" : "No usage yet";
    return new Date(firstUseDate).toLocaleDateString(isHe ? "he-IL" : "en-US");
  };

  const Arrow = isHe ? ChevronLeft : ChevronRight;

  // Quick actions with uniform deep blue/gold styling
  const quickActions = [
    { to: "/create", icon: Wand2, label: t("dash.startCreate") },
    { to: "/pricing", icon: CreditCard, label: t("dash.manageSub") },
    { to: "/support", icon: HeadphonesIcon, label: t("dash.supportTitle") },
  ];

  return (
    <div className="px-5 pt-8 pb-6 space-y-7 max-w-lg mx-auto" dir={isHe ? "rtl" : "ltr"}>

      {/* Greeting */}
      <div className="animate-float-up">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
          {isHe ? "שלום" : "Hello"}
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {userName}
        </h1>
      </div>

      {/* Credits card */}
      <div className="glass-card rounded-2xl p-5 space-y-4 animate-float-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t("dash.plan")}</p>
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary" strokeWidth={1.5} />
              <span className="text-sm font-bold text-foreground">Free</span>
            </div>
          </div>
          <Link
            to="/pricing"
            className="gradient-glow glow-shadow text-white text-xs font-semibold px-4 py-2 rounded-xl hover:scale-105 transition-transform"
          >
            {t("dash.upgrade")}
          </Link>
        </div>

        {/* Credit progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t("dash.credits")}</span>
            <span className="font-semibold text-foreground">
              {creditsLeft} / {creditsTotal}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full gradient-glow rounded-full transition-all duration-700"
              style={{ width: `${creditPct}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {creditPct}% {isHe ? "קרדיטים נותרים" : "credits remaining"}
          </p>
        </div>

        {/* First Use & Next Renewal Dates */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar size={11} strokeWidth={1.5} />
              {isHe ? "שימוש ראשון:" : "First Use:"}
            </span>
            <span className="font-medium text-foreground">{formatFirstUseDate()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar size={11} strokeWidth={1.5} />
              {isHe ? "חידוש הבא:" : "Next Renewal:"}
            </span>
            <span className="font-medium text-foreground">{getNextRenewalDate()}</span>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="glass-card rounded-2xl p-5 animate-float-up" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} strokeWidth={1.5} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">{t("dash.activity")}</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <PenTool size={14} strokeWidth={1.5} className="text-muted-foreground" />
              {t("dash.creations")}
            </span>
            <span className="text-sm font-semibold text-foreground">{creationsCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Download size={14} strokeWidth={1.5} className="text-muted-foreground" />
              {t("dash.downloads")}
            </span>
            <span className="text-sm font-semibold text-foreground">{downloadsCount}</span>
          </div>
        </div>
      </div>

      {/* Quick actions — Uniform deep blue with gold text styling */}
      <div className="animate-float-up" style={{ animationDelay: "180ms" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {t("dash.quickActions")}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center p-4 rounded-2xl hover:scale-[1.03] transition-all duration-200 group"
              style={{
                background: "hsl(210 100% 12%)",
                boxShadow: "0 4px 20px -4px hsl(210 100% 12% / 0.35), 0 2px 10px -2px hsl(39 48% 56% / 0.15)"
              }}
            >
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-2"
                style={{ background: "hsl(210 100% 16%)" }}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: "hsl(39 48% 56%)" }}
                />
              </div>
              <p 
                className="text-xs font-bold text-center leading-tight"
                style={{ color: "hsl(39 48% 56%)" }}
              >
                {label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
