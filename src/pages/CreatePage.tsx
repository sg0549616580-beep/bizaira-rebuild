import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import {
  Camera, MessageSquare, BarChart3, CalendarClock, DollarSign, BookOpen,
  Sparkles,
} from "lucide-react";

const CreatePage = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const isHe = lang === "he";

  // Consolidated tools - Photo Studio now includes Product Photos functionality
  const toolTypes = [
    { id: "studio",    icon: Camera,       titleKey: "tool.studio.title",     descKey: "tool.studio.desc",    route: "/create/product-photos", accent: true },
    { id: "message",   icon: MessageSquare,titleKey: "tool.messages.title",   descKey: "tool.messages.desc",  route: "/create/messages",        accent: false },
    { id: "analytics", icon: BarChart3,    titleKey: "tool.analytics.title",  descKey: "tool.analytics.desc", route: "/create/analytics",       accent: false },
    { id: "time",      icon: CalendarClock,titleKey: "tool.time.title",       descKey: "tool.time.desc",      route: "/create/time",            accent: false },
    { id: "pricing",   icon: DollarSign,   titleKey: "tool.pricing.title",    descKey: "tool.pricing.desc",   route: "/create/pricing",         accent: false },
    { id: "journal",   icon: BookOpen,     titleKey: "tool.journal.title",    descKey: "tool.journal.desc",   route: "/journal",                accent: false },
  ];

  return (
    <div className="px-5 pt-8 pb-28" dir={isHe ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          {isHe ? "סטודיו AI" : "AI Studio"}
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {t("create.title")}
        </h1>
      </div>

      {/* Featured tool — full width accent card */}
      <button
        onClick={() => navigate(toolTypes[0].route)}
        className="w-full glass-card rounded-2xl p-5 mb-4 flex items-center gap-4 hover:shadow-lg transition-all duration-200 group animate-float-up glow-shadow"
      >
        <div className="w-12 h-12 rounded-2xl gradient-glow flex items-center justify-center shrink-0 shadow-md">
          <Camera size={22} strokeWidth={1.5} className="text-white" />
        </div>
        <div className="flex-1 text-start">
          <div className="text-sm font-bold gradient-glow-text mb-0.5">{t(toolTypes[0].titleKey)}</div>
          <div className="text-xs text-muted-foreground leading-relaxed">{t(toolTypes[0].descKey)}</div>
        </div>
        <div className="w-6 h-6 rounded-full gradient-glow flex items-center justify-center shrink-0 opacity-70">
          <Sparkles size={12} className="text-white" />
        </div>
      </button>

      {/* Grid of remaining tools */}
      <div className="grid grid-cols-2 gap-3">
        {toolTypes.slice(1).map((tool, i) => {
          const IconComp = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className="glass-card rounded-2xl p-4 text-start hover:shadow-md hover:border-gray-200 transition-all duration-200 group animate-float-up"
              style={{ animationDelay: `${(i + 1) * 55}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                <IconComp size={18} strokeWidth={1.5} className="text-primary" />
              </div>
              <div className="text-sm font-semibold text-foreground group-hover:gradient-glow-text transition-colors leading-snug">
                {t(tool.titleKey)}
              </div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {t(tool.descKey)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreatePage;
