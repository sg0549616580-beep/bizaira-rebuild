import { Link } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { Wand2, CreditCard, HeadphonesIcon, Calendar, TrendingUp, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const { t, lang } = useI18n();
  const { user, profile } = useAuth();

  const userName = user?.user_metadata?.full_name || (lang === "he" ? "אורח" : "Guest");
  const creditsUsed = profile?.credits_used ?? 0;
  const creditsTotal = profile?.credits_total ?? 5;
  const credits = { used: creditsUsed, total: creditsTotal };
  const renewalDate = profile?.last_renewal_at
    ? new Date(profile.last_renewal_at).toLocaleDateString(lang === "he" ? "he-IL" : "en-US")
    : "—";

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6 animate-float-up">
        <h1 className="text-2xl font-bold mb-1 text-foreground">
          {lang === "he" ? `היי, ${userName}` : `Hi, ${userName}`}
        </h1>
        <p className="text-muted-foreground text-sm">{t("dash.welcome")}</p>
      </div>

      {/* Plan & Credits Card */}
      <div className="glass-card rounded-2xl p-5 mb-5 relative overflow-hidden glow-shadow animate-float-up" style={{ animationDelay: '100ms' }}>
        <div className="absolute top-0 left-0 w-full h-1 gradient-glow" />
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-muted-foreground">{t("dash.plan")}</span>
            <div className="font-bold text-foreground flex items-center gap-1">
              <SparkleIcon size={14} />
              Free
            </div>
          </div>
          <Link to="/pricing" className="gradient-glow text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-xl hover:scale-105 transition-all">
            {t("dash.upgrade")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-xl p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">{t("dash.credits")}</div>
            <div className="text-lg font-bold text-foreground">{credits.total - credits.used} / {credits.total}</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">{t("dash.renewal")}</div>
            <div className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Calendar size={12} />
              {renewalDate}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-1.5 bg-muted/30 rounded-lg p-2.5 border border-border">
          <Info size={12} className="text-muted-foreground shrink-0 mt-0.5" />
          <span className="text-[11px] text-muted-foreground leading-relaxed">
            {lang === "he"
              ? "הקרדיטים מתחדשים בדיוק חודש לאחר תחילת החבילה או החידוש האחרון."
              : "Credits renew exactly one month after your plan start date or last renewal."}
          </span>
        </div>
      </div>

      {/* Activity */}
      <div className="glass-card rounded-2xl p-4 mb-5 animate-float-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-primary" />
          <span className="font-semibold text-sm">{t("dash.activity")}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("dash.creations")}</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("dash.downloads")}</span>
            <span className="font-semibold">0</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="font-bold text-base mb-3 text-foreground">{t("dash.quickActions")}</h3>
      <div className="space-y-3">
        <Link to="/create" className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] hover:glow-shadow transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl gradient-glow flex items-center justify-center shadow-md">
            <Wand2 size={20} className="text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm group-hover:gradient-glow-text transition-all">{t("dash.startCreate")}</div>
            <div className="text-xs text-muted-foreground">{t("dash.startCreateDesc")}</div>
          </div>
        </Link>
        <Link to="/pricing" className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <CreditCard size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm">{t("dash.manageSub")}</div>
            <div className="text-xs text-muted-foreground">{t("dash.manageSubDesc")}</div>
          </div>
        </Link>
        <Link to="/support" className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <HeadphonesIcon size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm">{t("dash.supportTitle")}</div>
            <div className="text-xs text-muted-foreground">{t("dash.supportDesc")}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
