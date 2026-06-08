import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, differenceInDays, format } from "date-fns";

interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
}

interface LeadStats {
  total: number;
  previous: number;
  change: number;
  changePercent: number;
}

export const useLeadsStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["leads-stats", filters.startDate, filters.endDate],
    queryFn: async (): Promise<LeadStats> => {
      const periodDays = differenceInDays(filters.endDate, filters.startDate);
      const previousStart = subDays(filters.startDate, periodDays);
      const previousEnd = subDays(filters.endDate, periodDays);

      // Current period
      const { count: currentCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      // Previous period
      const { count: previousCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());

      const current = currentCount || 0;
      const previous = previousCount || 0;
      const change = current - previous;
      const changePercent = previous > 0 ? ((change / previous) * 100) : 0;

      return {
        total: current,
        previous,
        change,
        changePercent,
      };
    },
  });
};

export const useLeadsBySource = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["leads-by-source", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("source")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const sourceMap = new Map<string, number>();
      data?.forEach((lead) => {
        const source = lead.source || "direto";
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });

      return Array.from(sourceMap, ([name, value]) => ({ name, value }));
    },
  });
};

export const useLeadsTimeline = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["leads-timeline", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("created_at, source")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString())
        .order("created_at", { ascending: true });

      const dateMap = new Map<string, { agendamentos: number; chat: number }>();
      
      data?.forEach((lead) => {
        const date = format(new Date(lead.created_at), "dd/MM");
        if (!dateMap.has(date)) {
          dateMap.set(date, { agendamentos: 0, chat: 0 });
        }
        const entry = dateMap.get(date)!;
        if (lead.source === "demo" || lead.source === "agendamento") {
          entry.agendamentos++;
        } else {
          entry.chat++;
        }
      });

      return Array.from(dateMap, ([date, values]) => ({
        date,
        agendamentos: values.agendamentos,
        chat: values.chat,
      }));
    },
  });
};

export const useConversionRate = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["conversion-rate", filters.startDate, filters.endDate],
    queryFn: async () => {
      // Get visitors count
      const { data: visitorData } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const uniqueVisitors = new Set(visitorData?.map((e) => e.session_id)).size;

      // Get leads count
      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      const leads = leadsCount || 0;
      const rate = uniqueVisitors > 0 ? (leads / uniqueVisitors) * 100 : 0;

      return {
        visitors: uniqueVisitors,
        leads,
        rate,
      };
    },
  });
};

export const useAgendamentosCount = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["agendamentos-count", filters.startDate, filters.endDate],
    queryFn: async () => {
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      return count || 0;
    },
  });
};
