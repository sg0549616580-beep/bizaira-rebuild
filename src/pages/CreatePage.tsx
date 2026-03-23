import { useNavigate } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";
import {
  Presentation, Camera, MessageSquare, BarChart3, CalendarClock, DollarSign, Paintbrush,
} from "lucide-react";

const CreatePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const toolTypes = [
    { id: "presentation", icon: Presentation, titleKey: "tool.presentation.title", descKey: "tool.presentation.desc", route: "/create/presentation" },
    { id: "product", icon: Camera, titleKey: "tool.photos.title", descKey: "tool.photos.desc", route: "/create/product-photos" },
    { id: "message", icon: MessageSquare, titleKey: "tool.messages.title", descKey: "tool.messages.desc", route: "/create/messages" },
    { id: "analytics", icon: BarChart3, titleKey: "tool.analytics.title", descKey: "tool.analytics.desc", route: "/create/analytics" },
    { id: "time", icon: CalendarClock, titleKey: "tool.time.title", descKey: "tool.time.desc", route: "/create/time" },
    { id: "pricing", icon: DollarSign, titleKey: "tool.pricing.title", descKey: "tool.pricing.desc", route: "/create/pricing" },
    { id: "studio", icon: Paintbrush, titleKey: "tool.studio.title", descKey: "tool.studio.desc", route: "/create/image-studio" },
  ];

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-2 mb-6">
        <SparkleIcon size={20} />
        <h1 className="text-xl font-bold text-foreground">{t("create.title")}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {toolTypes.map((tool, i) => {
          const IconComp = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className="glass-card rounded-2xl p-4 text-start hover:scale-[1.03] hover:glow-shadow transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-2">
                <IconComp size={20} className="text-secondary-foreground" />
              </div>
              <div className="font-semibold text-sm text-foreground group-hover:gradient-glow-text transition-all">
                {t(tool.titleKey)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
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
