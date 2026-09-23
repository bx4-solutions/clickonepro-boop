import { useTranslation } from "react-i18next";
import { Moon, AlertTriangle, ShieldCheck, PhoneCall, Calendar, Clock, BellRing, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AfterHoursEmergencySectionProps {
  className?: string;
}

export const AfterHoursEmergencySection = ({ className = "" }: AfterHoursEmergencySectionProps) => {
  const { t } = useTranslation();

  return (
    <section className={`py-20 bg-muted/30 border-y border-border relative overflow-hidden ${className}`}>
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Moon className="w-3.5 h-3.5" />
            <span>{t("emergency.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            {t("emergency.title")}{" "}
            <span className="text-primary">{t("emergency.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {t("emergency.subtitle")}
          </p>
        </div>

        {/* 2-Column Comparison Grid: Regular After-Hours vs Emergency Routing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Standard After-Hours Booking */}
          <div className="bg-card border border-border/80 rounded-2xl p-8 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {t("emergency.routineLabel")}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {t("emergency.routineTitle")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t("emergency.routineDesc")}
              </p>

              {/* Step Flow List */}
              <div className="space-y-3 border-t border-border/50 pt-6">
                <div className="flex items-start gap-3 text-xs text-foreground">
                  <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{t("emergency.routineStep1")}</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-foreground">
                  <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{t("emergency.routineStep2")}</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-foreground">
                  <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{t("emergency.routineStep3")}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-medium">
              💡 {t("emergency.routineOutcome")}
            </div>
          </div>

          {/* Card 2: Emergency Real-Time Routing */}
          <div className="bg-card border-2 border-amber-500/30 rounded-2xl p-8 shadow-sm hover:border-amber-500/60 transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {t("emergency.criticalLabel")}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {t("emergency.criticalTitle")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t("emergency.criticalDesc")}
              </p>

              {/* Step Flow List */}
              <div className="space-y-3 border-t border-border/50 pt-6">
                <div className="flex items-start gap-3 text-xs text-foreground">
                  <PhoneCall className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t("emergency.criticalStep1")}</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t("emergency.criticalStep2")}</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-foreground">
                  <BellRing className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t("emergency.criticalStep3")}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 font-medium">
              🔥 {t("emergency.criticalOutcome")}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t("emergency.footerNote")}
          </p>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link to="/agendar-demo">
              {t("common.bookFreeDemo")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AfterHoursEmergencySection;
