import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
}

// Interface is intentionally NOT exported to prevent circular dependencies
// Each consuming file should define its own local interface
interface FunnelData {
  visitors: number;
  pageviews: number;
  leads: number;
  agendamentos: number;
  clientes: number;
  rates: {
    visitorsToPageviews: number;
    pageviewsToLeads: number;
    leadsToAgendamentos: number;
    agendamentosToClientes: number;
  };
}

export const useFunnelData = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["funnel-data", filters.startDate, filters.endDate],
    queryFn: async (): Promise<FunnelData> => {
      // Get unique visitors
      const { data: visitorData } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const visitors = new Set(visitorData?.map((e) => e.session_id)).size;

      // Get total pageviews
      const { count: pageviewCount } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const pageviews = pageviewCount || 0;

      // Get total leads
      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const leads = leadsCount || 0;

      // Get agendamentos = todos os leads (no Siding Depot toda cotação é um agendamento)
      const { count: agendamentosCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const agendamentos = agendamentosCount || 0;

      // Get clientes (status = convertido)
      const { count: clientesCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "convertido")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const clientes = clientesCount || 0;

      // Calculate conversion rates
      const rates = {
        visitorsToPageviews: visitors > 0 ? (pageviews / visitors) * 100 : 0,
        pageviewsToLeads: pageviews > 0 ? (leads / pageviews) * 100 : 0,
        leadsToAgendamentos: leads > 0 ? (agendamentos / leads) * 100 : 0,
        agendamentosToClientes: agendamentos > 0 ? (clientes / agendamentos) * 100 : 0,
      };

      return {
        visitors,
        pageviews,
        leads,
        agendamentos,
        clientes,
        rates,
      };
    },
  });
};
