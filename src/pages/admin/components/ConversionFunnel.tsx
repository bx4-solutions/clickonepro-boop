// ConversionFunnel - Funil de Vendas SaaS em Português
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useFunnelData } from "@/hooks/use-funnel-data";
import { usePipelineTimeline } from "@/hooks/use-pipeline-timeline";
import { Binoculars, Lightbulb, MessageCircle, MousePointer, Trophy, DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import html2canvas from "html2canvas";

interface ConversionFunnelProps {
  filters: {
    startDate: Date;
    endDate: Date;
  };
  baseValueUSD: number;
  onBaseValueChange: (value: number) => void;
}

// Local interface to avoid circular dependencies
interface FunnelDataLocal {
  visitors: number;
  pageviews: number;
  leads: number;
  agendamentos: number;
  clientes: number;
  rates?: {
    visitorsToPageviews: number;
    pageviewsToLeads: number;
    leadsToAgendamentos: number;
    agendamentosToClientes: number;
  };
}

export interface FunnelRef {
  captureAsImage: () => Promise<string>;
  getData: () => FunnelDataLocal | null;
}

const FUNNEL_STAGES = [
  { key: "visitors", label: "Prospecção", icon: Binoculars, color: "#3C4A07" },
  { key: "pageviews", label: "Alcance", icon: Lightbulb, color: "#5a6f0a" },
  { key: "leads", label: "Descoberta e Qualificação", icon: MessageCircle, color: "#81A00E" },
  { key: "agendamentos", label: "Demonstração", icon: MousePointer, color: "#A4CC12" },
  { key: "clientes", label: "Fechamento", icon: Trophy, color: "#B6E214" },
];

// Etapas que têm valor monetário (a partir do lead)
const STAGES_WITH_VALUE = ["leads", "agendamentos", "clientes"];

const ConversionFunnel = forwardRef<FunnelRef, ConversionFunnelProps>(({ filters, baseValueUSD, onBaseValueChange }, ref) => {
  const funnelRef = useRef<HTMLDivElement>(null);
  const { data: funnelData, isLoading } = useFunnelData(filters);
  const { data: pipelineData } = usePipelineTimeline(filters, baseValueUSD);
  const comparison = pipelineData?.comparison;

  // Mock data for demonstration when no real data exists
  const mockData: FunnelDataLocal = {
    visitors: 2847,
    pageviews: 4521,
    leads: 342,
    agendamentos: 89,
    clientes: 34,
    rates: {
      visitorsToPageviews: 158.7,
      pageviewsToLeads: 7.6,
      leadsToAgendamentos: 26.0,
      agendamentosToClientes: 38.2,
    },
  };

  const hasRealData = funnelData && (funnelData.visitors > 0 || funnelData.leads > 0);
  const data = hasRealData ? funnelData : mockData;

  // Funções de valor monetário
  const hasValue = (stageKey: string): boolean => STAGES_WITH_VALUE.includes(stageKey);

  const formatValue = (quantity: number): string => {
    const total = quantity * baseValueUSD;
    return total.toLocaleString("en-US", { 
      style: "currency", 
      currency: "USD",
      maximumFractionDigits: 0 
    });
  };

  const formatValueCompact = (quantity: number): string => {
    const total = quantity * baseValueUSD;
    if (total >= 1000000) return `$${(total / 1000000).toFixed(1)}M`;
    if (total >= 1000) return `$${Math.round(total / 1000)}K`;
    return `$${total}`;
  };

  // Valor total do pipeline (leads + agendamentos + clientes)
  const totalPipelineValue = (data.leads + data.agendamentos + data.clientes) * baseValueUSD;

  useImperativeHandle(ref, () => ({
    captureAsImage: async () => {
      if (!funnelRef.current) return "";
      try {
        const canvas = await html2canvas(funnelRef.current, {
          backgroundColor: null,
          scale: 2,
        });
        return canvas.toDataURL("image/png");
      } catch (error) {
        console.error("Error capturing funnel:", error);
        return "";
      }
    },
    getData: () => data as FunnelDataLocal,
  }));

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const values: Record<string, number> = {
    visitors: data.visitors,
    pageviews: data.pageviews,
    leads: data.leads,
    agendamentos: data.agendamentos,
    clientes: data.clientes,
  };

  // Width percentages for each stage (SaaS funnel narrowing)
  const widthPercentages = [100, 82, 66, 52, 40];

  // Calculate conversion rates between stages
  const getConversionRate = (fromIndex: number): string => {
    if (fromIndex >= FUNNEL_STAGES.length - 1) return "";
    const fromKey = FUNNEL_STAGES[fromIndex].key;
    const toKey = FUNNEL_STAGES[fromIndex + 1].key;
    const fromValue = values[fromKey];
    const toValue = values[toKey];
    if (fromValue === 0) return "0%";
    return `${((toValue / fromValue) * 100).toFixed(1)}%`;
  };

  const getTooltipContent = (index: number): string => {
    if (index >= FUNNEL_STAGES.length - 1) {
      return `${FUNNEL_STAGES[index].label}: ${values[FUNNEL_STAGES[index].key].toLocaleString("pt-BR")} negócios fechados`;
    }
    const nextStage = FUNNEL_STAGES[index + 1];
    const rate = getConversionRate(index);
    return `${rate} convertem para ${nextStage.label}`;
  };

  // Abbreviated labels for mobile
  const getMobileLabel = (label: string) => {
    const abbreviations: Record<string, string> = {
      "Prospecção": "Prosp.",
      "Alcance": "Alc.",
      "Descoberta e Qualificação": "Desc.",
      "Demonstração": "Demo",
      "Fechamento": "Fech.",
    };
    return abbreviations[label] || label.split(" ")[0];
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-1 md:pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base md:text-lg">Funil de Vendas SaaS</CardTitle>
          {/* Campo editável para valor base */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Valor/Lead:</span>
            <Input
              type="number"
              value={baseValueUSD}
              onChange={(e) => onBaseValueChange(Number(e.target.value) || 0)}
              className="w-20 h-7 text-xs text-right"
              min={0}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <TooltipProvider>
          <div ref={funnelRef} className="flex flex-col items-center space-y-1 md:space-y-2 bg-card p-2 md:p-4 rounded-lg">
            {FUNNEL_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const value = values[stage.key];
              const widthPercent = widthPercentages[index];
              const showValue = hasValue(stage.key);
              
              return (
                <div 
                  key={stage.key} 
                  className="flex flex-col items-center w-full animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Funnel Bar - trapezoid shape centered */}
                      <div 
                        className="relative flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-3 transition-all duration-300 hover:opacity-90 hover:scale-[1.02] cursor-pointer"
                        style={{ 
                          width: `${widthPercent}%`,
                          backgroundColor: stage.color,
                          clipPath: "polygon(4% 0, 96% 0, 100% 100%, 0 100%)",
                        }}
                      >
                        {/* Icon in white rounded square */}
                        <div className="flex items-center justify-center w-4 h-4 sm:w-7 sm:h-7 bg-white rounded-md">
                          <Icon className="h-2.5 w-2.5 sm:h-4 sm:w-4" style={{ color: stage.color }} />
                        </div>
                        {/* Number in white circle */}
                        <span 
                          className="flex items-center justify-center w-3.5 h-3.5 sm:w-6 sm:h-6 rounded-full bg-white font-bold text-[8px] sm:text-xs"
                          style={{ color: stage.color }}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-card border border-border shadow-lg z-50"
                    >
                      <div className="text-sm">
                        <p className="font-semibold" style={{ color: stage.color }}>
                          {stage.label}
                        </p>
                        <p className="text-muted-foreground">
                          {value.toLocaleString("pt-BR")} contatos
                        </p>
                        {showValue && (
                          <p className="font-bold text-green-600">
                            {formatValue(value)}
                          </p>
                        )}
                        {index < FUNNEL_STAGES.length - 1 && (
                          <p className="mt-1 font-medium" style={{ color: FUNNEL_STAGES[index + 1].color }}>
                            ↓ {getTooltipContent(index)}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  {/* Label and Value below bar */}
                  <div className="text-center mt-0.5 sm:mt-1">
                    {/* Desktop */}
                    <p className="hidden sm:block text-xs font-semibold" style={{ color: stage.color }}>
                      {stage.label} ({value.toLocaleString("pt-BR")})
                      {showValue && (
                        <span className="text-green-600 ml-1">
                          - {formatValue(value)}
                        </span>
                      )}
                    </p>
                    
                    {/* Mobile */}
                    <div className="sm:hidden">
                      <p className="text-[9px] font-semibold" style={{ color: stage.color }}>
                        {getMobileLabel(stage.label)} ({value.toLocaleString("pt-BR")})
                      </p>
                      {showValue && (
                        <p className="text-[10px] font-bold text-green-600">
                          {formatValueCompact(value)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Métricas Resumidas */}
        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
          {/* Valor Total do Pipeline */}
          <div className="text-center mb-3">
            <p className="text-[10px] md:text-xs text-muted-foreground">Valor do Pipeline (Leads)</p>
            <p className="text-lg md:text-xl font-bold text-green-600">
              {totalPipelineValue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
            </p>
            {comparison && (
              <div className="flex items-center justify-center gap-1 mt-1">
                {comparison.valueChangePercent === 0 ? (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                ) : comparison.valueChangePercent > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs ${
                  comparison.valueChangePercent === 0 ? "text-muted-foreground" :
                  comparison.valueChangePercent > 0 ? "text-green-600" : "text-destructive"
                }`}>
                  {comparison.valueChangePercent > 0 ? "+" : ""}{comparison.valueChangePercent.toFixed(1)}%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  vs {comparison.previousValue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>
          
          {/* Taxas de Conversão */}
          <div className="grid grid-cols-2 gap-2 md:gap-4 text-center">
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Prospecto → Qualificado</p>
              <p className="text-base md:text-lg font-bold" style={{ color: "#3C4A07" }}>
                {data.visitors > 0 ? ((data.leads / data.visitors) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Demo → Fechado</p>
              <p className="text-base md:text-lg font-bold" style={{ color: "#A4CC12" }}>
                {data.leads > 0 ? ((data.clientes / data.leads) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ConversionFunnel.displayName = "ConversionFunnel";

export default ConversionFunnel;
