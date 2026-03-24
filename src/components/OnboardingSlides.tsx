import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface OnboardingSlidesProps {
  onComplete: () => void;
}

const OnboardingSlides = ({ onComplete }: OnboardingSlidesProps) => {
  const { lang } = useI18n();
  const [current, setCurrent] = useState(0);

  const slides = lang === "he"
    ? [
        {
          title: "ברוכים הבאים ל-BizAIra",
          desc: "הכלי הכי פשוט ונוח ליצירת תוכן מקצועי לעסק שלך. בלי ידע טכני, בלי מאמץ — פשוט מתחילים ומקבלים תוצאות.",
        },
        {
          title: "הכל מוכן בשבילך",
          desc: "מצגות, תמונות מוצר, טקסטים שיווקיים ועוד — הכל נוצר אוטומטית ומותאם בדיוק לעסק שלך, בכמה לחיצות בלבד.",
        },
        {
          title: "פשוט, מהיר ונעים",
          desc: "כל פעולה באפליקציה מרגישה קלה וטבעית. אין תפריטים מסובכים, אין בלבול — רק חוויה חלקה מהתחלה ועד הסוף.",
        },
      ]
    : [
        {
          title: "Welcome to BizAIra",
          desc: "The easiest and most intuitive way to create professional content for your business. No technical skills needed — just start and get results.",
        },
        {
          title: "Everything Ready for You",
          desc: "Product photos, marketing texts, business analytics and more — all created automatically and tailored exactly to your business, in just a few clicks.",
        },
        {
          title: "Simple, Fast & Enjoyable",
          desc: "Every action in the app feels light and natural. No complicated menus, no confusion — just a smooth experience from start to finish.",
        },
      ];

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else onComplete();
  };
  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const isRTL = lang === "he";

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-background px-6">
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-6 end-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {lang === "he" ? "דלג" : "Skip"}
      </button>

      {/* Slide content */}
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-glow glow-shadow flex items-center justify-center mx-auto mb-6">
            <Sparkles size={28} className="text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-4 transition-all duration-300">
            {slides[current].title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed transition-all duration-300">
            {slides[current].desc}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-6 gradient-glow" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Navigation - arrows only, no text */}
        <div className="flex items-center justify-center gap-4">
          {current > 0 && (
            <button
              onClick={prev}
              className="w-12 h-12 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
          <button
            onClick={next}
            className="w-12 h-12 rounded-xl gradient-glow glow-shadow flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlides;
