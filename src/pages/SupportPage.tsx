import { useState } from "react";
import { Send, ChevronDown, ChevronUp, MessageCircle, HelpCircle } from "lucide-react";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";

const SupportPage = () => {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="animate-float-up">
        <h1 className="text-2xl font-extrabold mb-2 text-foreground flex items-center gap-2">
          <HelpCircle size={24} className="text-primary" />
          {t("support.title")}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {t("support.subtitle")}
        </p>
      </div>

      {/* Step 1: FAQ */}
      <h3 className="font-bold text-base mb-4 text-foreground flex items-center gap-2">
        <SparkleIcon size={14} />
        {t("support.faq")}
      </h3>
      <div className="space-y-2 mb-6">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden transition-all hover:border-primary/30">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="font-semibold text-sm text-foreground text-start">
                {faq.q}
              </span>
              {openFaq === i ? (
                <ChevronUp size={16} className="text-primary shrink-0 ms-2" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground shrink-0 ms-2" />
              )}
            </button>
            {openFaq === i && (
              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed animate-float-up">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step 2: Contact */}
      <div className="glass-card rounded-2xl p-5 mb-6 animate-float-up" style={{ animationDelay: "100ms" }}>
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <MessageCircle size={16} className="text-primary" />
          {t("support.contact")}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("support.name")}
            className="w-full bg-background border border-border rounded-xl px-3 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("support.email")}
            className="w-full bg-background border border-border rounded-xl px-3 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            dir="ltr"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("support.message")}
            className="w-full bg-background border border-border rounded-xl px-3 py-3 text-foreground placeholder:text-muted-foreground text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <button className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
            <Send size={16} />
            {t("support.send")}
          </button>
        </div>
      </div>

    </div>
  );
};

export default SupportPage;
