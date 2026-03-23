import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthSectionProps {
  onSuccess?: () => void;
}

const AuthSection = ({ onSuccess }: AuthSectionProps) => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (onSuccess) onSuccess();
        else navigate("/");
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
    <div className="max-w-md mx-auto w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold gradient-glow-text mb-1">BizAIra</h2>
        <p className="text-muted-foreground text-sm">
          {isLogin
            ? (lang === "he" ? "שמחים לראות אותך שוב" : "Welcome back")
            : (lang === "he" ? "הצטרפו לסטודיו AI" : "Join the AI Studio")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
        {!isLogin && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              {lang === "he" ? "שם מלא" : "Full Name"}
            </label>
            <div className="relative">
              <User size={15} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "he" ? "השם שלך" : "Your name"}
                className="w-full h-11 bg-background border border-input rounded-xl pe-10 ps-4 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all"
              />
            </div>
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
            {lang === "he" ? "אימייל" : "Email"}
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full h-11 bg-background border border-input rounded-xl pl-10 pr-4 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all text-left"
              dir="ltr"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
            {lang === "he" ? "סיסמה" : "Password"}
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 bg-background border border-input rounded-xl pl-10 pr-4 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all text-left"
              dir="ltr"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-2xl text-base flex items-center justify-center gap-2 mt-2 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {isLogin
            ? (lang === "he" ? "התחבר" : "Log In")
            : (lang === "he" ? "צור חשבון" : "Create Account")}
        </button>

        <div className="text-center pt-1">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-accent hover:text-accent/80 transition-colors">
            {isLogin
              ? (lang === "he" ? "אין לך חשבון? הירשם" : "Don't have an account? Sign up")
              : (lang === "he" ? "כבר יש לך חשבון? התחבר" : "Already have an account? Log in")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthSection;
