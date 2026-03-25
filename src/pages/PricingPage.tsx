import { Check, Rocket } from "lucide-react";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";

const PricingPage = () => {
  const { t, lang } = useI18n();

  const plans = [
    {
      name: "Free",
      price: lang === "he" ? "₪0" : "$0",
      priceLabel: t("pricing.startFree"),
      highlight: false,
      features: [
        "2 AI creations / month",
        "Standard quality",
        "Watermark",
        "Basic controls",
        "Selected tools",
      ],
      featuresHe: [
        "2 יצירות AI בחודש",
        "איכות סטנדרטית",
        "סימן מים",
        "שליטה בסיסית",
        "כלים נבחרים",
      ],
    },
    {
      name: "Pro",
      price: lang === "he" ? "₪29" : "$9",
      period: lang === "he" ? "/ לחודש" : "/ month",
      priceLabel: t("pricing.upgradeNow"),
      highlight: true,
      features: [
        "Unlimited creations",
        "Presentations, product photos",
        "AI Messages",
        "High quality",
        "No watermarks",
        "Full control of all tools",
      ],
      featuresHe: [
        "יצירות ללא הגבלה",
        "תמונות מוצר, תוכן שיווקי",
        "הודעות AI",
        "איכות גבוהה",
        "ללא סימני מים",
        "שליטה מלאה בכל הכלים",
      ],
    },
    {
      name: "Business",
      price: lang === "he" ? "₪59" : "$19",
      period: lang === "he" ? "/ לחודש" : "/ month",
      priceLabel: t("pricing.upgradeNow"),
      highlight: false,
      features: [
        "Everything in Pro",
        "Maximum file quality",
        "Advanced business analytics",
        "Smart pricing system",
        "Smart time management",
        "Multiple versions per creation",
        "AI processing priority",
        "Large image packs",
      ],
      featuresHe: [
        "הכל ב-Pro",
        "איכות קבצים מקסימלית",
        "ניתוח עסקי מתקדם",
        "מערכת תמחור חכמה",
        "ניהול זמן חכם",
        "יצירת גרסאות מרובות",
        "עדיפות בעיבוד AI",
        "חבילות תמונות גדולות",
      ],
    },
  ];

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="text-center mb-8 animate-float-up">
        <h1 className="text-3xl font-extrabold mb-2 text-foreground">{t("pricing.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("pricing.subtitle")}</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {plans.map((plan, i) => {
          const featureList = lang === "he" ? plan.featuresHe : plan.features;
          return (
            <div
              key={plan.name}
              className={`rounded-2xl p-5 transition-all duration-300 animate-float-up ${plan.highlight ? "gradient-glow glow-shadow relative" : "glass-card"}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card text-xs font-bold px-3 py-1 rounded-full gradient-glow-text border border-border">
                  <SparkleIcon size={10} className="inline me-1" />
                  {t("pricing.popular")}
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-bold ${plan.highlight ? "text-primary-foreground" : "text-foreground"}`}>{plan.name}</h3>
                <div className="text-end">
                  <span className={`text-xl font-extrabold ${plan.highlight ? "text-primary-foreground" : "gradient-glow-text"}`}>{plan.price}</span>
                  {"period" in plan && <span className={`text-xs ms-1 ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{(plan as any).period}</span>}
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {featureList.map((feature) => (
                  <li key={feature} className={`flex items-center gap-2 text-sm ${plan.highlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                    <Check size={14} className={plan.highlight ? "text-primary-foreground" : "text-primary"} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] ${plan.highlight ? "bg-card text-foreground hover:bg-card/90" : "gradient-glow text-primary-foreground glow-shadow"}`}>
                <Rocket size={16} />
                {plan.name === "Free" ? t("pricing.startFree") : t("pricing.upgradeNow")}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">{t("pricing.footer")}</p>
    </div>
  );
};

export default PricingPage;
