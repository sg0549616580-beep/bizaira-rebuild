import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import {
  Camera, MessageSquare, BarChart3, CalendarClock, DollarSign, BookOpen,
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

      {/* Uniform grid of tool cards — minimalist luxury cubes */}
      <div className="grid grid-cols-2 gap-3">
        {toolTypes.map((tool, i) => {
          const IconComp = tool.icon;
          const isFirst = i === 0;
          return (
            <button
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className="flex flex-col items-center justify-center p-5 rounded-2xl hover:scale-[1.03] transition-all duration-200 group animate-float-up aspect-square"
              style={{ 
                animationDelay: `${i * 55}ms`,
                background: isFirst ? "hsl(210 100% 12%)" : "hsl(0 0% 98%)",
                boxShadow: isFirst 
                  ? "0 6px 24px -4px hsl(210 100% 12% / 0.4), 0 3px 12px -2px hsl(39 48% 56% / 0.2)"
                  : "0 2px 12px -2px hsl(0 0% 0% / 0.06), 0 1px 4px -1px hsl(0 0% 0% / 0.04)",
                border: isFirst ? "none" : "1px solid hsl(0 0% 92%)"
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ 
                  background: isFirst ? "hsl(210 100% 16%)" : "hsl(0 0% 94%)"
                }}
              >
                <IconComp
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: isFirst ? "hsl(39 48% 56%)" : "hsl(210 100% 20%)" }}
                />
              </div>
              <div 
                className="text-sm font-bold text-center leading-snug mb-1"
                style={{ color: isFirst ? "hsl(39 48% 56%)" : "hsl(210 100% 12%)" }}
              >
                {t(tool.titleKey)}
              </div>
              <div 
                className="text-[10px] text-center leading-relaxed opacity-80 px-1"
                style={{ color: isFirst ? "hsl(39 48% 70%)" : "hsl(0 0% 50%)" }}
              >
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
