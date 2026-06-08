import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTopPages, usePagePerformance, AnalyticsFilters } from "@/hooks/useAnalytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface SiteTabProps {
  filters: AnalyticsFilters;
}

const SiteTab = ({ filters }: SiteTabProps) => {
  const { data: topPages, isLoading } = useTopPages(filters);
  const { data: pagePerformance } = usePagePerformance(filters);

  const radarData = pagePerformance && pagePerformance.length > 0
    ? pagePerformance.slice(0, 5).map((p) => ({
        page: p.path.replace("/", "") || "Home",
        views: p.views,
        scroll: p.avgScroll || 0,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho de Todas as Páginas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Página</TableHead>
                <TableHead className="text-right">Visualizações</TableHead>
                <TableHead className="text-right">Tempo Médio</TableHead>
                <TableHead className="text-right">Prof. de Scroll</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(pagePerformance || []).map((page) => (
                <TableRow key={page.path}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{page.title || page.path}</div>
                      <div className="text-xs text-muted-foreground">{page.path}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {page.avgTime != null ? `${Math.floor(page.avgTime / 60)}m ${page.avgTime % 60}s` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {page.avgScroll != null ? `${page.avgScroll}%` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Entry vs Exit Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas de Entrada vs Saída</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPages?.slice(0, 5) || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="path" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--chart-1))" name="Entrada" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Page Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-border" />
                  <PolarAngleAxis dataKey="page" className="text-muted-foreground" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Visualizações"
                    dataKey="views"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Engajamento"
                    dataKey="scroll"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteTab;
