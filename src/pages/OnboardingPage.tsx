import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, ArrowRight, Briefcase, User, Mail, Lock, Wand2, BarChart3, MessageSquare, Camera } from "lucide-react";
import SparkleIcon from "@/components/SparkleIcon";
import bizairaLogo from "@/assets/bizaira-logo.png";
import { useI18n } from "@/lib/i18n";

const BUSINESS_TYPES_HE = [
  "קוסמטיקה וטיפוח", "עיצוב פנים", "צילום", "מאמנת עסקית",
  "מעצבת גרפית", "מטפלת", "חנות אונליין", "מסעדה / קייטרינג",
  "עורכת דין", "רואת חשבון", "אחר",
];
const BUSINESS_TYPES_EN = [
  "Beauty & Cosmetics", "Interior Design", "Photography", "Business Coach",
  "Graphic Designer", "Therapist", "Online Store", "Restaurant / Catering",
  "Attorney", "Accountant", "Other",
];

const OnboardingPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const businessTypes = lang === "he" ? BUSINESS_TYPES_HE : BUSINESS_TYPES_EN;
  const BackArrow = lang === "he" ? ArrowLeft : ArrowRight;
  const NextArrow = lang === "he" ? ArrowRight : ArrowLeft;

  const handleFinish = () => {
    navigate("/dashboard");
  };

  const features = [
    {
      icon: Wand2,
      title: lang === "he" ? "יצירת תוכן שיווקי" : "Marketing Content Creation",
      desc: lang === "he" ? "תמונות מוצר, ניסוחים מקצועיים ותוכן שיווקי בלחיצה" : "Product photos, professional copy and marketing content in one click",
    },
    {
      icon: BarChart3,
      title: lang === "he" ? "ניתוח עסקי חכם" : "Smart Business Analytics",
      desc: lang === "he" ? "תובנות, רווחיות וחיזוי — כמו יועץ עסקי אישי" : "Insights, profitability and forecasting — like a personal business advisor",
    },
    {
      icon: MessageSquare,
      title: lang === "he" ? "ניסוח הודעות AI" : "AI Message Writing",
      desc: lang === "he" ? "הודעות מכירה, שירות ופוסטים ברמת קופירייטר" : "Sales, service and social messages at copywriter level",
    },
    {
      icon: Camera,
      title: lang === "he" ? "סטודיו תמונות" : "Photo Studio",
      desc: lang === "he" ? "תמונות מוצר ברמת צלם מקצועי, מוכנות לשיווק" : "Professional photographer-level product photos, marketing-ready",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={bizairaLogo} alt="BizAIra" className="h-14 mx-auto mb-3" />
          <div className="flex items-center justify-center gap-2 mb-1">
            {[0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-8 gradient-glow" : s < step ? "w-4 bg-primary/40" : "w-4 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 0: Business Type */}
        {step === 0 && (
          <div className="glass-card rounded-2xl p-6 glow-shadow animate-float-up">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {lang === "he" ? "מה סוג העסק שלך?" : "What type of business do you have?"}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {businessTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setBusinessType(type)}
                  className={`text-sm rounded-xl px-3 py-2.5 border transition-all text-start ${
                    businessType === type
                      ? "border-primary bg-secondary text-foreground font-semibold"
                      : "border-border bg-background text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => businessType && setStep(1)}
              disabled={!businessType}
              className="w-full gradient-glow text-primary-foreground font-bold py-3 rounded-2xl mt-5 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              {lang === "he" ? "המשך" : "Continue"}
              <NextArrow size={16} />
            </button>
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="glass-card rounded-2xl p-6 glow-shadow animate-float-up">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {lang === "he" ? "מה השם שלך?" : "What's your name?"}
              </h2>
            </div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={lang === "he" ? "השם שלך" : "Your name"}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              autoFocus
            />
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setStep(0)}
                className="bg-secondary border border-border px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                <BackArrow size={16} />
              </button>
              <button
                onClick={() => userName.trim() && setStep(2)}
                disabled={!userName.trim()}
                className="flex-1 gradient-glow text-primary-foreground font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                {lang === "he" ? "המשך" : "Continue"}
                <NextArrow size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Email + Password */}
        {step === 2 && (
          <div className="glass-card rounded-2xl p-6 glow-shadow animate-float-up">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {lang === "he" ? "התחברות באמצעות אימייל" : "Sign in with email"}
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  {lang === "he" ? "אימייל" : "Email"}
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-background border border-border rounded-xl pe-10 ps-3 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    dir="ltr"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  {lang === "he" ? "סיסמה" : "Password"}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-border rounded-xl pe-10 ps-3 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setStep(1)}
                className="bg-secondary border border-border px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                <BackArrow size={16} />
              </button>
              <button
                onClick={() => email && password && setStep(3)}
                disabled={!email || !password}
                className="flex-1 gradient-glow text-primary-foreground font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                <Sparkles size={16} />
                {lang === "he" ? "צור חשבון" : "Create Account"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: App explanation */}
        {step === 3 && (
          <div className="animate-float-up">
            <div className="text-center mb-6">
              <h2 className="text-xl font-extrabold text-foreground mb-2">
                {lang === "he" ? `ברוך הבא, ${userName}!` : `Welcome, ${userName}!`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {lang === "he"
                  ? "BizAIra היא מערכת AI שיוצרת לעסק שלך תוכן שיווקי מקצועי — בלחיצה."
                  : "BizAIra is an AI system that creates professional marketing content for your business — in one click."}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-4 flex items-start gap-3 animate-float-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="w-9 h-9 rounded-xl gradient-glow flex items-center justify-center shrink-0 shadow-md">
                      <Icon size={18} className="text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{feat.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{feat.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleFinish}
              className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition-all animate-glow-pulse"
            >
              <SparkleIcon size={16} />
              {lang === "he" ? "בואו נתחיל!" : "Let's get started!"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
