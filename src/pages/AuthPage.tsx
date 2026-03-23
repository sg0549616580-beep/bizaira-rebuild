import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { Sparkles, Mail, Lock, User, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const BackArrow = lang === "he" ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(lang === "he" ? "נא למלא אימייל וסיסמה" : "Please fill in email and password");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(lang === "he" ? "התחברת בהצלחה!" : "Logged in successfully!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success(lang === "he" ? "החשבון נוצר! בדוק את האימייל שלך" : "Account created! Check your email");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold gradient-glow-text mb-2">BizAIra</h2>
          <p className="text-muted-foreground text-sm">
            {isLogin ? t("auth.welcomeBack") : t("auth.joinStudio")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 glow-shadow">
          <div className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">{t("auth.fullName")}</label>
                <div className="relative">
                  <User size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.namePlaceholder")}
                    className="w-full bg-background border border-border rounded-xl pe-10 ps-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">{t("auth.emailLabel")}</label>
              <div className="relative">
                <Mail size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full bg-background border border-border rounded-xl pe-10 ps-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">{t("auth.passwordLabel")}</label>
              <div className="relative">
                <Lock size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl pe-10 ps-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" dir="ltr" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3.5 rounded-2xl text-base flex items-center justify-center gap-2 mt-6 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isLogin ? t("auth.login") : t("auth.createAccount")}
          </button>

          <div className="mt-4 text-center space-y-2">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-accent hover:text-accent/80">
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            </button>
            {isLogin && (
              <button type="button" className="block mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("auth.forgotPassword")}
              </button>
            )}
          </div>
        </form>

        <Link to="/" className="flex items-center justify-center gap-1 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <BackArrow size={14} />
          {t("auth.backHome")}
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;
