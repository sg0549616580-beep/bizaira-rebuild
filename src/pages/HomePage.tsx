import { Link } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const HomePage = () => {
  const { t, lang } = useI18n();
  const BackArrow = lang === "he" ? ArrowLeft : ArrowRight;

  const tools = [
    { title: t("tool.photos.title"), desc: t("tool.photos.desc"), to: "/create/product-photos" },
    { title: t("tool.messages.title"), desc: t("tool.messages.desc"), to: "/create/messages" },
    { title: t("tool.analytics.title"), desc: t("tool.analytics.desc"), to: "/create/analytics" },
    { title: t("tool.time.title"), desc: t("tool.time.desc"), to: "/create/time" },
    { title: t("tool.pricing.title"), desc: t("tool.pricing.desc"), to: "/create/pricing" },
  ];

  const slides = [
    { title: t("home.slide1.title"), desc: t("home.slide1.desc") },
    { title: t("home.slide2.title"), desc: t("home.slide2.desc") },
    { title: t("home.slide3.title"), desc: t("home.slide3.desc") },
  ];

  return (
    <div className="px-4 pt-8 pb-4">
      {/* Hero */}
      <div className="text-center mb-12 animate-float-up pt-4">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
          <span className="text-foreground">{t("home.hero.title1")}</span>
          <br />
          <span className="gradient-glow-text">{t("home.hero.title2")}</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mx-auto mb-9">
          {t("home.hero.desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            to="/create"
            className="gradient-glow glow-shadow text-primary-foreground font-bold px-8 py-4 rounded-2xl text-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 animate-glow-pulse"
          >
            <Sparkles size={20} />
            {t("home.cta.start")}
          </Link>
          <Link
            to="/auth"
            className="bg-card border border-border text-foreground font-semibold px-8 py-4 rounded-2xl text-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:border-primary/40"
          >
            {t("home.cta.auth")}
            <BackArrow size={18} />
          </Link>
        </div>
      </div>

      {/* Explanation slides */}
      <div className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h4 className="font-bold text-sm text-foreground mb-2">{slide.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{slide.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-5 text-foreground flex items-center gap-2">
          <SparkleIcon size={14} />
          {t("home.tools.title")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool, i) => (
            <Link
              key={tool.title}
              to={tool.to}
              className="glass-card rounded-2xl p-4 hover:scale-[1.03] hover:glow-shadow transition-all duration-300 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="font-semibold text-sm text-foreground group-hover:gradient-glow-text transition-all">
                {tool.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {tool.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
