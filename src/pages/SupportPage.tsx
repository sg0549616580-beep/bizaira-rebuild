import { useState } from "react";
import { Send, ChevronDown, ChevronUp, MessageCircle, HelpCircle, Download, FileText, Mail } from "lucide-react";
import SparkleIcon from "@/components/SparkleIcon";
import { useI18n } from "@/lib/i18n";

const SupportPage = () => {
  const { t, lang } = useI18n();
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

  const features = [
    {
      title: t("feature.presentation.title"),
      items: [t("feature.presentation.1"), t("feature.presentation.2"), t("feature.presentation.3"), t("feature.presentation.4")],
    },
    {
      title: t("feature.product.title"),
      items: [t("feature.product.1"), t("feature.product.2"), t("feature.product.3"), t("feature.product.4")],
    },
    {
      title: t("feature.messages.title"),
      items: [t("feature.messages.1"), t("feature.messages.2"), t("feature.messages.3"), t("feature.messages.4")],
    },
    {
      title: t("feature.analytics.title"),
      items: [t("feature.analytics.1"), t("feature.analytics.2"), t("feature.analytics.3"), t("feature.analytics.4")],
    },
    {
      title: t("feature.time.title"),
      items: [t("feature.time.1"), t("feature.time.2"), t("feature.time.3"), t("feature.time.4")],
    },
    {
      title: t("feature.pricing.title"),
      items: [t("feature.pricing.1"), t("feature.pricing.2"), t("feature.pricing.3"), t("feature.pricing.4")],
    },
    {
      title: t("feature.imagestudio.title"),
      items: [t("feature.imagestudio.1"), t("feature.imagestudio.2"), t("feature.imagestudio.3"), t("feature.imagestudio.4")],
    },
  ];

  const handleExportPDF = () => {
    const content = features
      .map((f) => `${f.title}\n${f.items.map((item, i) => `  ${i + 1}. ${item}`).join("\n")}`)
      .join("\n\n");

    const fullContent = `BizAIra — ${t("support.features")}\n${"=".repeat(40)}\n\n${content}\n\n${"=".repeat(40)}\nwww.bizaira.com`;

    const blob = new Blob([fullContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BizAIra-Features.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

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

      {/* Step 3: Features explanation - clean text only */}
      <div className="glass-card rounded-2xl p-5 mb-6 animate-float-up" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base text-foreground">
            {t("support.features")}
          </h3>
          <button
            onClick={handleExportPDF}
            className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:scale-105 transition-all border border-border"
          >
            {t("support.export")}
          </button>
        </div>

        <div className="space-y-6">
          {features.map((feature, i) => (
            <div key={i}>
              <h4 className="text-sm font-bold text-foreground mb-3">{feature.title}</h4>
              <div className="space-y-2">
                {feature.items.map((item, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
              {i < features.length - 1 && (
                <div className="border-b border-border mt-5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
