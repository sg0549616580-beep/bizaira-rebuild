import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import SplashScreen from "@/components/SplashScreen";
import OnboardingSlides from "@/components/OnboardingSlides";
import AuthSection from "@/components/AuthSection";

type Step = "splash" | "slides" | "main";

const LandingPage = () => {
  const { lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Always start from splash on every page load
  const [step, setStep] = useState<Step>("splash");

  useEffect(() => {
    if (!loading && user) {
      setStep("main");
    }
  }, [user, loading]);

  const onSplashComplete = useCallback(() => {
    if (user) {
      setStep("main");
    } else {
      setStep("slides");
    }
  }, [user]);

  const onSlidesComplete = useCallback(() => {
    setStep("main");
  }, []);

  const handleGuestContinue = () => {
    navigate("/create");
  };

  if (step === "splash") {
    return <SplashScreen onComplete={onSplashComplete} />;
  }

  if (step === "slides") {
    return <OnboardingSlides onComplete={onSlidesComplete} />;
  }

  // Main: Hero title + Auth or Welcome
  return (
    <div className="px-4 pt-8 pb-4 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-10 pt-4">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
          <span className="text-foreground">
            {lang === "he" ? "ה-AI שיוצר לעסק שלך" : "AI That Creates For Your Business"}
          </span>
          <br />
          <span className="gradient-glow-text">
            {lang === "he" ? "הכול במקום אחד" : "Everything In One Place"}
          </span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mx-auto">
          {lang === "he"
            ? "יצירת מצגות, תמונות מוצר, קבצי PDF ותוכן שיווקי — בתוך כמה שניות בלבד בעזרת AI."
            : "Create presentations, product photos, PDFs and marketing content — in just seconds with AI."}
        </p>
      </div>

      {/* Auth section for non-logged-in users */}
      {!user && (
        <div className="mb-8">
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {lang === "he" ? "צרו חשבון והתחילו עכשיו" : "Create an Account & Start Now"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "he"
                ? "הירשמו בקלות והתחילו להשתמש במערכת"
                : "Sign up easily and start using the system"}
            </p>
          </div>
          <AuthSection onSuccess={() => {}} />

          {/* Guest continue */}
          <div className="text-center mt-5">
            <button
              onClick={handleGuestContinue}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              {lang === "he" ? "המשך כאורח →" : "Continue as Guest →"}
            </button>
          </div>
        </div>
      )}

      {/* Welcome for logged-in users */}
      {user && (
        <div className="text-center">
          <p className="text-lg text-foreground font-semibold">
            {lang === "he"
              ? `שלום, ${user.user_metadata?.full_name || ""}! 👋`
              : `Hello, ${user.user_metadata?.full_name || ""}! 👋`}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "he" ? "נווט ליצירה דרך התפריט למטה" : "Navigate to Create from the menu below"}
          </p>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
