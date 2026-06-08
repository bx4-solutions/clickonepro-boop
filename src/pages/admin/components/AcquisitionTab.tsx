import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "./StatsCard";
import { Link, Share2, Search, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "recharts";
import { AnalyticsFilters, useAcquisitionStats } from "@/hooks/useAnalytics";

interface AcquisitionTabProps {
  filters: AnalyticsFilters;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const AcquisitionTab = ({ filters }: AcquisitionTabProps) => {
  const { data: acquisitionData } = useAcquisitionStats(filters);

  const trafficSourcesData = acquisitionData?.sources || [];
  const utmCampaigns = acquisitionData?.utmCampaigns || [];
  const trafficTrendData: never[] = [];

  const getSourceValue = (name: string) =>
    trafficSourcesData.find((s) => s.name === name)?.value || 0;

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <StatsCard
          title="Direto"
          value={getSourceValue("Direto")}
          icon={Link}
        />
        <StatsCard
          title="Busca Orgânica"
          value={getSourceValue("Busca Orgânica")}
          icon={Search}
        />
        <StatsCard
          title="Social"
          value={getSourceValue("Social")}
          icon={Share2}
        />
        <StatsCard
          title="Referência"
          value={getSourceValue("Referência")}
          icon={Mail}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Traffic Sources Pie */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Fontes de Tráfego</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <div className="h-56 md:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => {
                      const short = name.length > 6 ? name.slice(0, 6) + "." : name;
                      return `${short} ${(percent * 100).toFixed(0)}%`;
                    }}
                    labelLine={false}
                  >
                    {trafficSourcesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Tráfego por Fonte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficTrendData}>
                  <defs>
                    <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="direct"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#colorDirect)"
                    strokeWidth={2}
                    name="Direto"
                  />
                  <Area
                    type="monotone"
                    dataKey="organic"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#colorOrganic)"
                    strokeWidth={2}
                    name="Orgânico"
                  />
                  <Area
                    type="monotone"
                    dataKey="social"
                    stroke="hsl(var(--chart-3))"
                    fill="url(#colorSocial)"
                    strokeWidth={2}
                    name="Social"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UTM Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campanhas UTM</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fonte</TableHead>
                <TableHead>Meio</TableHead>
                <TableHead>Campanha</TableHead>
                <TableHead className="text-right">Visitantes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utmCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    Nenhuma campanha UTM registrada ainda.
                  </TableCell>
                </TableRow>
              ) : (
                utmCampaigns.map((campaign, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{campaign.source}</TableCell>
                    <TableCell>{campaign.medium}</TableCell>
                    <TableCell>{campaign.campaign}</TableCell>
                    <TableCell className="text-right">{campaign.visitors.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcquisitionTab;
