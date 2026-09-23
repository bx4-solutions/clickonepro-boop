import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface FAQItem {
  question: string;
  answer: string;
}

export const getFAQItems = (t: (key: string) => string): FAQItem[] => [
  {
    question: t("faq.q1"),
    answer: t("faq.a1"),
  },
  {
    question: t("faq.q2"),
    answer: t("faq.a2"),
  },
  {
    question: t("faq.q3"),
    answer: t("faq.a3"),
  },
  {
    question: t("faq.q4"),
    answer: t("faq.a4"),
  },
  {
    question: t("faq.q5"),
    answer: t("faq.a5"),
  },
  {
    question: t("faq.q6"),
    answer: t("faq.a6"),
  },
];

interface GEOFAQSectionProps {
  className?: string;
}

export const GEOFAQSection = ({ className = "" }: GEOFAQSectionProps) => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqList = getFAQItems(t);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-20 bg-background relative overflow-hidden ${className}`}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t("faq.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            {t("faq.title")}{" "}
            <span className="text-primary">{t("faq.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqList.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-card border-primary/40 shadow-lg shadow-primary/5"
                    : "bg-card/60 border-border/70 hover:border-border"
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base md:text-lg text-foreground flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      0{index + 1}
                    </span>
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-muted-foreground text-sm md:text-base leading-relaxed border-t border-border/40 mt-1">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Callout Bottom */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {t("faq.stillHaveQuestions")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("faq.speakWithSpecialist")}
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="whitespace-nowrap">
            <Link to="/agendar-demo">{t("common.bookFreeDemo")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GEOFAQSection;
