import { Users, Eye, Clock, MousePointerClick } from "lucide-react";
import StatsCard from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useVisitorStats,
  usePageviewStats,
  useTimelineData,
  useDeviceStats,
  useTopPages,
  useAvgTimeOnPage,
  useBounceRate,
  AnalyticsFilters,
} from "@/hooks/useAnalytics";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OverviewTabProps {
  filters: AnalyticsFilters;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const OverviewTab = ({ filters }: OverviewTabProps) => {
  const { data: visitorStats, isLoading: visitorsLoading } = useVisitorStats(filters);
  const { data: pageviewStats, isLoading: pageviewsLoading } = usePageviewStats(filters);
  const { data: timelineData, isLoading: timelineLoading } = useTimelineData(filters);
  const { data: deviceData, isLoading: devicesLoading } = useDeviceStats(filters);
  const { data: topPages, isLoading: topPagesLoading } = useTopPages(filters);
  const { data: avgTimeStats } = useAvgTimeOnPage(filters);
  const { data: bounceStats } = useBounceRate(filters);

  // Generate sparkline data from timeline
  const sparklineData = timelineData?.slice(-7).map((d) => ({ value: d.visitors })) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <StatsCard
          title="Visitantes Totais"
          value={visitorStats?.current || 0}
          changePercent={visitorStats?.changePercent}
          comparePeriod="vs período anterior"
          icon={Users}
          sparklineData={sparklineData}
        />
        <StatsCard
          title="Visualizações"
          value={pageviewStats?.current || 0}
          changePercent={pageviewStats?.changePercent}
          comparePeriod="vs período anterior"
          icon={Eye}
          sparklineData={sparklineData}
        />
        <StatsCard
          title="Tempo Médio no Site"
          value={avgTimeStats?.current || 0}
          changePercent={avgTimeStats?.changePercent}
          comparePeriod="vs período anterior"
          icon={Clock}
          format="time"
        />
        <StatsCard
          title="Taxa de Rejeição"
          value={bounceStats?.current || 0}
          changePercent={bounceStats?.changePercent}
          comparePeriod="vs período anterior"
          icon={MousePointerClick}
          format="percent"
        />
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Tráfego</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData || []}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "d MMM", { locale: ptBR })}
                  className="text-muted-foreground"
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(value) => format(new Date(value), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#colorVisitors)"
                  strokeWidth={2}
                  name="Visitantes"
                />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  stroke="hsl(var(--chart-2))"
                  fill="url(#colorPageviews)"
                  strokeWidth={2}
                  name="Visualizações"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Dispositivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {(deviceData || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Mais Visitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPages?.slice(0, 5) || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-muted-foreground" />
                  <YAxis
                    type="category"
                    dataKey="path"
                    width={120}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
