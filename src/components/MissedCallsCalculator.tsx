import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calculator, DollarSign, TrendingDown, ArrowRight, ShieldAlert, Sparkles, Plus, Minus, PhoneMissed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MissedCallsCalculatorProps {
  className?: string;
}

export const MissedCallsCalculator = ({ className = "" }: MissedCallsCalculatorProps) => {
  const { t } = useTranslation();

  // State sliders
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState<number>(6);
  const [averageTicket, setAverageTicket] = useState<number>(1800);
  const [closeRate, setCloseRate] = useState<number>(30); // percentage

  // Percentages for custom slider track fills
  const callsPercent = useMemo(() => ((missedCallsPerWeek - 1) / (30 - 1)) * 100, [missedCallsPerWeek]);
  const ticketPercent = useMemo(() => ((averageTicket - 300) / (15000 - 300)) * 100, [averageTicket]);
  const ratePercent = useMemo(() => ((closeRate - 10) / (70 - 10)) * 100, [closeRate]);

  // Calculations
  const { lostMonthly, lostAnnually, recoveredMonthly, totalCallsMonth, lostJobsMonth } = useMemo(() => {
    const monthlyMissedCalls = missedCallsPerWeek * 4.33;
    const potentialLostJobs = monthlyMissedCalls * (closeRate / 100);
    const lostMonthlyVal = Math.round(potentialLostJobs * averageTicket);
    const lostAnnuallyVal = lostMonthlyVal * 12;
    // Assuming ClickOne recovers 85% of those missed leads
    const recoveredVal = Math.round(lostMonthlyVal * 0.85);

    return {
      lostMonthly: lostMonthlyVal,
      lostAnnually: lostAnnuallyVal,
      recoveredMonthly: recoveredVal,
      totalCallsMonth: Math.round(monthlyMissedCalls),
      lostJobsMonth: Math.max(1, Math.round(potentialLostJobs)),
    };
  }, [missedCallsPerWeek, averageTicket, closeRate]);

  return (
    <section className={`py-20 bg-background relative overflow-hidden ${className}`}>
      {/* Background radial highlight */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t("calculator.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {t("calculator.title")}{" "}
            <span className="text-primary">{t("calculator.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {t("calculator.subtitle")}
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col space-y-6">
            
            {/* Control 1: Missed Calls per Week */}
            <div className="bg-muted/40 p-5 rounded-2xl border border-border/60">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                    <PhoneMissed className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground block">
                      {t("calculator.sliderCallsLabel")}
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      (~{Math.round(missedCallsPerWeek * 4.33)} chamadas por mês)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setMissedCallsPerWeek((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-background border border-border hover:bg-primary/10 hover:border-primary/40 text-foreground flex items-center justify-center transition-all font-bold cursor-pointer"
                    aria-label="Diminuir chamadas"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-3.5 py-1.5 bg-primary text-primary-foreground font-black text-sm rounded-xl min-w-[95px] text-center shadow-md shadow-primary/20">
                    {missedCallsPerWeek} {t("calculator.callsPerWeek")}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMissedCallsPerWeek((prev) => Math.min(30, prev + 1))}
                    className="w-8 h-8 rounded-lg bg-background border border-border hover:bg-primary/10 hover:border-primary/40 text-foreground flex items-center justify-center transition-all font-bold cursor-pointer"
                    aria-label="Aumentar chamadas"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Fill Range Input */}
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={missedCallsPerWeek}
                onChange={(e) => setMissedCallsPerWeek(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${callsPercent}%, hsl(var(--muted)) ${callsPercent}%, hsl(var(--muted)) 100%)`
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-primary border border-border/40"
              />

              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                <span>1 {t("calculator.call")}/sem</span>
                <span className="font-bold text-primary">{missedCallsPerWeek} selecionadas</span>
                <span>30 {t("calculator.calls")}/sem</span>
              </div>
            </div>

            {/* Control 2: Average Job / Ticket Value */}
            <div className="bg-muted/40 p-5 rounded-2xl border border-border/60">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground block">
                      {t("calculator.sliderTicketLabel")}
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Valor médio cobrado por serviço
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setAverageTicket((prev) => Math.max(300, prev - 100))}
                    className="w-8 h-8 rounded-lg bg-background border border-border hover:bg-primary/10 hover:border-primary/40 text-foreground flex items-center justify-center transition-all font-bold cursor-pointer"
                    aria-label="Diminuir ticket"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-3.5 py-1.5 bg-primary text-primary-foreground font-black text-sm rounded-xl min-w-[95px] text-center shadow-md shadow-primary/20">
                    ${averageTicket.toLocaleString("en-US")}
                  </div>

                  <button
                    type="button"
                    onClick={() => setAverageTicket((prev) => Math.min(15000, prev + 100))}
                    className="w-8 h-8 rounded-lg bg-background border border-border hover:bg-primary/10 hover:border-primary/40 text-foreground flex items-center justify-center transition-all font-bold cursor-pointer"
                    aria-label="Aumentar ticket"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Fill Range Input */}
              <input
                type="range"
                min="300"
                max="15000"
                step="100"
                value={averageTicket}
                onChange={(e) => setAverageTicket(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${ticketPercent}%, hsl(var(--muted)) ${ticketPercent}%, hsl(var(--muted)) 100%)`
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-primary border border-border/40"
              />

              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                <span>$300 (Serviços Rápidos)</span>
                <span className="font-bold text-primary">${averageTicket.toLocaleString("en-US")}</span>
                <span>$15.000 (Grandes Obras)</span>
              </div>
            </div>

            {/* Control 3: Close Rate */}
            <div className="bg-muted/40 p-5 rounded-2xl border border-border/60">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    %
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground block">
                      {t("calculator.sliderCloseRateLabel")}
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Percentual de clientes que fecham com você
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setCloseRate((prev) => Math.max(10, prev - 5))}
                    className="w-8 h-8 rounded-lg bg-background border border-border hover:bg-primary/10 hover:border-primary/40 text-foreground flex items-center justify-center transition-all font-bold cursor-pointer"
                    aria-label="Diminuir taxa"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-3.5 py-1.5 bg-primary text-primary-foreground font-black text-sm rounded-xl min-w-[70px] text-center shadow-md shadow-primary/20">
                    {closeRate}%
                  </div>

                  <button
                    type="button"
                    onClick={() => setCloseRate((prev) => Math.min(70, prev + 5))}
                    className="w-8 h-8 rounded-lg bg-background border border-border hover:bg-primary/10 hover:border-primary/40 text-foreground flex items-center justify-center transition-all font-bold cursor-pointer"
                    aria-label="Aumentar taxa"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Fill Range Input */}
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={closeRate}
                onChange={(e) => setCloseRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${ratePercent}%, hsl(var(--muted)) ${ratePercent}%, hsl(var(--muted)) 100%)`
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-primary border border-border/40"
              />

              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                <span>10% (Conservador)</span>
                <span className="font-bold text-primary">{closeRate}%</span>
                <span>70% (Alta Conversão)</span>
              </div>
            </div>

            {/* Diagnosis Feedback */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-xs sm:text-sm text-foreground flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                Com <strong>{missedCallsPerWeek} chamadas perdidas por semana</strong> (~{totalCallsMonth}/mês) e taxa de fechamento de <strong>{closeRate}%</strong>, sua empresa perde aproximadamente <strong className="text-destructive font-black text-sm">{lostJobsMonth} clientes por mês</strong>.
              </p>
            </div>
          </div>

          {/* Results Column (5 Cols) - ClickOne Official Theme */}
          <div className="lg:col-span-5 bg-card border-2 border-primary/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-destructive mb-6">
                <TrendingDown className="w-4 h-4" />
                <span>{t("calculator.estimatedLossHeader")}</span>
              </div>

              {/* Monthly Loss */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-1 font-semibold">
                  {t("calculator.monthlyLostRevenue")}
                </p>
                <div className="text-4xl sm:text-5xl font-black text-destructive tracking-tight">
                  -${lostMonthly.toLocaleString("en-US")}
                  <span className="text-sm font-medium text-muted-foreground">/{t("calculator.month")}</span>
                </div>
              </div>

              {/* Annual Loss Card */}
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
                <p className="text-xs text-destructive font-bold mb-1">
                  {t("calculator.annualLostRevenue")}:
                </p>
                <p className="text-2xl sm:text-3xl font-black text-destructive">
                  -${lostAnnually.toLocaleString("en-US")} / {t("calculator.year")}
                </p>
              </div>

              {/* Recovered Card with ClickOne */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t("calculator.withClickOne")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1 font-medium">
                  {t("calculator.recoverUpTo")}
                </p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  +${recoveredMonthly.toLocaleString("en-US")}/mês
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Button asChild className="w-full h-auto min-h-[52px] py-3.5 px-4 sm:px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] cursor-pointer">
              <Link to="/agendar-demo" className="flex items-center justify-center text-center gap-2 w-full text-center">
                <span className="leading-snug">{t("calculator.ctaButton")}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissedCallsCalculator;
