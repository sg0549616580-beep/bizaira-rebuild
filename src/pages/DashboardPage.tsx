import { Link } from "react-router-dom";
import { Wand2, CreditCard, HeadphonesIcon, Calendar, TrendingUp, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const { t, lang } = useI18n();
  const { user, profile } = useAuth();
  const isHe = lang === "he";

  const userName = user?.user_metadata?.full_name || (isHe ? "אורח" : "Guest");
  const creditsUsed = profile?.credits_used ?? 0;
  const creditsTotal = profile?.credits_total ?? 5;
  const creditsLeft = creditsTotal - creditsUsed;
  const creditPct = creditsTotal > 0 ? Math.round((creditsLeft / creditsTotal) * 100) : 0;
  const renewalDate = profile?.last_renewal_at
    ? new Date(profile.last_renewal_at).toLocaleDateString(isHe ? "he-IL" : "en-US")
    : "—";

  const Arrow = isHe ? ChevronLeft : ChevronRight;

  const quickActions = [
    {
      to: "/create",
      icon: Wand2,
      label: t("dash.startCreate"),
      desc: t("dash.startCreateDesc"),
      accent: true,
    },
    {
      to: "/pricing",
      icon: CreditCard,
      label: t("dash.manageSub"),
      desc: t("dash.manageSubDesc"),
      accent: false,
    },
    {
      to: "/support",
      icon: HeadphonesIcon,
      label: t("dash.supportTitle"),
      desc: t("dash.supportDesc"),
      accent: false,
    },
  ];

  return (
    <div className="px-5 pt-8 pb-6 space-y-7 max-w-lg mx-auto" dir={isHe ? "rtl" : "ltr"}>

      {/* Greeting */}
      <div className="animate-float-up">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
          {isHe ? "שלום" : "Hello"}
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {userName} 👋
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

        {/* Renewal */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-gray-100">
          <Calendar size={11} strokeWidth={1.5} />
          <span>
            {isHe ? "חידוש:" : "Renewal:"} {renewalDate}
          </span>
        </div>
      </div>

      {/* Activity */}
      <div className="glass-card rounded-2xl p-5 animate-float-up" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} strokeWidth={1.5} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">{t("dash.activity")}</span>
        </div>
        <div className="space-y-3">
          {[
            { label: t("dash.creations"), value: 0 },
            { label: t("dash.downloads"), value: 0 },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-semibold text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="animate-float-up" style={{ animationDelay: "180ms" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {t("dash.quickActions")}
        </p>
        <div className="space-y-2.5">
          {quickActions.map(({ to, icon: Icon, label, desc, accent }) => (
            <Link
              key={to}
              to={to}
              className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                accent ? "gradient-glow glow-shadow" : "bg-gray-50 border border-gray-100"
              }`}>
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className={accent ? "text-white" : "text-muted-foreground"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${accent ? "gradient-glow-text" : "text-foreground"}`}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
              </div>
              <Arrow
                size={16}
                strokeWidth={1.5}
                className="text-gray-300 group-hover:text-primary transition-colors shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
