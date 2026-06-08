import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, MousePointerClick, MessageCircle, Clock, Percent, Globe, Monitor, Smartphone, Tablet, Download, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useVisitorStats, usePageviewStats, useTimelineData, useDeviceStats, useTopPages, useCountryStats } from "@/hooks/useAnalytics";
import { useLeadsStats, useConversionRate, useAgendamentosCount, useLeadsTimeline } from "@/hooks/useLeadsStats";
import { useFunnelData } from "@/hooks/use-funnel-data";
import ConversionFunnel, { FunnelRef } from "./ConversionFunnel";
import PipelineValueChart from "./PipelineValueChart";
import ExportReportDialog from "./ExportReportDialog";
import ScheduledReportsManager from "./ScheduledReportsManager";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DashboardTabProps {
  filters: {
    startDate: Date;
    endDate: Date;
  };
  onRefresh?: () => void;
  onRefreshStart?: () => void;
}

// Local interface to avoid circular type dependencies
interface ExportDataLocal {
  filters: { startDate: Date; endDate: Date };
  funnel: {
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
  };
  funnelImage?: string;
  visitors: number;
  pageviews: number;
  leads: number;
  conversionRate: number;
  topPages: Array<{ path: string; title?: string; views: number }>;
  deviceStats: Array<{ name: string; value: number }>;
}

const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  success: "hsl(var(--chart-4))",
  accent: "hsl(var(--chart-5))",
};

const DashboardTab = ({ filters, onRefresh, onRefreshStart }: DashboardTabProps) => {
  const queryClient = useQueryClient();
  const funnelRef = useRef<FunnelRef>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportData, setExportData] = useState<ExportDataLocal | null>(null);
  const [baseValueUSD, setBaseValueUSD] = useState(497);
  
  // Pull-to-refresh state
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const PULL_THRESHOLD = 80;

  const { data: visitorStats } = useVisitorStats(filters);
  const { data: pageviewStats } = usePageviewStats(filters);
  const { data: leadsStats } = useLeadsStats(filters);
  const { data: conversionData } = useConversionRate(filters);
  const { data: agendamentosCount } = useAgendamentosCount(filters);
  const { data: timelineData } = useTimelineData(filters);
  const { data: leadsTimeline } = useLeadsTimeline(filters);
  const { data: deviceStats } = useDeviceStats(filters);
  const { data: topPages } = useTopPages(filters);
  const { data: countryStats } = useCountryStats(filters);
  const { data: funnelData } = useFunnelData(filters);

  const formatChange = (value: number | undefined) => {
    if (!value) return "0%";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Pull-to-refresh handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefreshStart?.();
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["analytics"] }),
      queryClient.invalidateQueries({ queryKey: ["leads-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["conversion-rate"] }),
      queryClient.invalidateQueries({ queryKey: ["agendamentos-count"] }),
      queryClient.invalidateQueries({ queryKey: ["leads-timeline"] }),
      queryClient.invalidateQueries({ queryKey: ["funnel-data"] }),
      queryClient.invalidateQueries({ queryKey: ["timeline"] }),
      queryClient.invalidateQueries({ queryKey: ["device-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["top-pages"] }),
      queryClient.invalidateQueries({ queryKey: ["country-stats"] }),
    ]);
    setIsRefreshing(false);
    onRefresh?.();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || window.scrollY > 0) return;
    const distance = Math.max(0, e.touches[0].clientY - startY.current);
    setPullDistance(Math.min(distance, PULL_THRESHOLD * 1.5));
  };

  const handleTouchEnd = () => {
    if (pullDistance >= PULL_THRESHOLD) {
      handleRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  const deviceData = deviceStats?.map((d) => ({
    name: d.name,
    value: d.value,
  })) || [];

  const handleExportClick = async () => {
    let funnelImage = "";
    
    if (funnelRef.current) {
      funnelImage = await funnelRef.current.captureAsImage();
    }

    const defaultFunnel = {
      visitors: 0,
      pageviews: 0,
      leads: 0,
      agendamentos: 0,
      clientes: 0,
      rates: {
        visitorsToPageviews: 0,
        pageviewsToLeads: 0,
        leadsToAgendamentos: 0,
        agendamentosToClientes: 0,
      },
    };

    setExportData({
      filters,
      funnel: funnelData || defaultFunnel,
      funnelImage,
      visitors: visitorStats?.current || 0,
      pageviews: pageviewStats?.current || 0,
      leads: leadsStats?.total || 0,
      conversionRate: conversionData?.rate || 0,
      topPages: topPages?.map(p => ({ path: p.path, title: p.title, views: p.views })) || [],
      deviceStats: deviceStats || [],
    });
    
    setIsExportDialogOpen(true);
  };

  return (
    <div 
      className="space-y-6"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator - Mobile only */}
      <div 
        className="md:hidden flex justify-center items-center transition-all duration-200 overflow-hidden"
        style={{ 
          height: pullDistance > 0 || isRefreshing ? `${Math.max(pullDistance, isRefreshing ? 50 : 0)}px` : 0,
          opacity: pullDistance > 0 || isRefreshing ? 1 : 0 
        }}
      >
        <div className="flex items-center gap-2">
          <RefreshCw 
            className={`h-5 w-5 text-primary transition-transform ${
              pullDistance >= PULL_THRESHOLD ? 'rotate-180' : ''
            } ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="text-sm text-muted-foreground">
            {isRefreshing 
              ? "Atualizando..." 
              : pullDistance >= PULL_THRESHOLD 
                ? "Solte para atualizar" 
                : "Puxe para atualizar"
            }
          </span>
        </div>
      </div>


      {/* Header with Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleExportClick} variant="outline" size="sm">
          <Download className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Exportar Relatório</span>
        </Button>
      </div>

      {/* Conversion Cards Row - 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-2.5 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                <MousePointerClick className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] md:text-sm text-muted-foreground truncate">Total Conversões</p>
                <p className="text-lg md:text-2xl font-bold">{leadsStats?.total || 0}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                  {formatChange(leadsStats?.changePercent)} vs anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-2.5 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                <Percent className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] md:text-sm text-muted-foreground truncate">Taxa Conversão</p>
                <p className="text-lg md:text-2xl font-bold">{conversionData?.rate.toFixed(2) || 0}%</p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                  {conversionData?.leads || 0} / {conversionData?.visitors || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chart-4/5 border-chart-4/20">
          <CardContent className="p-2.5 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-chart-4/10">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-chart-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] md:text-sm text-muted-foreground truncate">Agendamentos</p>
                <p className="text-lg md:text-2xl font-bold">{agendamentosCount || 0}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">Demos agendados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-2.5 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] md:text-sm text-muted-foreground truncate">Chat com Bia</p>
                <p className="text-lg md:text-2xl font-bold">-</p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">Interações</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Cards Row - Swipe on mobile, grid on desktop */}
      {(() => {
        const trafficCards = [
          { label: "Total Visitantes", value: visitorStats?.current || 0, change: formatChange(visitorStats?.changePercent), positive: (visitorStats?.changePercent || 0) >= 0 },
          { label: "Únicos", value: visitorStats?.current || 0, change: formatChange(visitorStats?.changePercent), positive: (visitorStats?.changePercent || 0) >= 0 },
          { label: "Visualizações", value: pageviewStats?.current || 0, change: formatChange(pageviewStats?.changePercent), positive: (pageviewStats?.changePercent || 0) >= 0 },
          { label: "Pág/Visita", value: visitorStats?.current ? ((pageviewStats?.current || 0) / visitorStats.current).toFixed(1) : "0", change: null, positive: true },
          { label: "Bounce", value: "-", change: null, positive: true },
          { label: "Tempo Médio", value: "-", change: null, positive: true },
        ];
        
        return (
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            {trafficCards.map((card, index) => (
              <Card key={index}>
                <CardContent className="p-2 md:p-4">
                  <p className="text-[10px] md:text-sm text-muted-foreground truncate">{card.label}</p>
                  <p className="text-sm md:text-2xl font-bold">{card.value}</p>
                  {card.change && (
                    <p className={`text-[9px] md:text-xs ${card.positive ? "text-chart-4" : "text-destructive"}`}>
                      {card.change}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })()}

      {/* Charts Row 1 - Funil + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funil de Conversão */}
        <ConversionFunnel 
          ref={funnelRef} 
          filters={filters} 
          baseValueUSD={baseValueUSD}
          onBaseValueChange={setBaseValueUSD}
        />

        {/* Evolução do Pipeline */}
        <PipelineValueChart 
          filters={filters} 
          baseValueUSD={baseValueUSD}
          onBaseValueChange={setBaseValueUSD}
        />
      </div>

      {/* Visualizações e Visitantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visualizações e Visitantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData || []}>
                <defs>
                  <linearGradient id="gradPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B6E214" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#B6E214" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradVisitantes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 13,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                  formatter={(value) => (
                    <span style={{ color: value === "Visualizações" ? "#B6E214" : "#22d3ee", fontWeight: 600 }}>
                      {value}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  name="Visualizações"
                  stroke="#B6E214"
                  strokeWidth={2.5}
                  fill="url(#gradPageviews)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#B6E214", stroke: "#fff", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  name="Visitantes"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fill="url(#gradVisitantes)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#22d3ee", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Páginas Mais Visitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages?.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{page.path}</span>
                  <span className="font-medium text-muted-foreground">{page.views}</span>
                </div>
              ))}
              {(!topPages || topPages.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitantes por País</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countryStats?.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{country.name || "Desconhecido"}</span>
                  <span className="font-medium text-muted-foreground">{country.value}</span>
                </div>
              ))}
              {(!countryStats || countryStats.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Reports Manager */}
      <ScheduledReportsManager />

      {/* Export Dialog */}
      <ExportReportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        exportData={exportData}
      />
    </div>
  );
};

export default DashboardTab;
