import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

export interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
  deviceType?: string;
  country?: string;
}

export interface StatsData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

export const useVisitorStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "visitors", filters],
    queryFn: async () => {
      const { data: currentData, error: currentError } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (currentError) throw currentError;

      const periodLength = filters.endDate.getTime() - filters.startDate.getTime();
      const previousStart = new Date(filters.startDate.getTime() - periodLength);
      const previousEnd = new Date(filters.endDate.getTime() - periodLength);

      const { data: previousData, error: previousError } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "pageview")
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());

      if (previousError) throw previousError;

      const currentUnique = new Set(currentData?.map((e) => e.session_id) || []).size;
      const previousUnique = new Set(previousData?.map((e) => e.session_id) || []).size;

      const change = currentUnique - previousUnique;
      const changePercent = previousUnique > 0 ? (change / previousUnique) * 100 : 0;

      return {
        current: currentUnique,
        previous: previousUnique,
        change,
        changePercent,
      } as StatsData;
    },
  });
};

export const usePageviewStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "pageviews", filters],
    queryFn: async () => {
      const { count: currentCount, error: currentError } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (currentError) throw currentError;

      const periodLength = filters.endDate.getTime() - filters.startDate.getTime();
      const previousStart = new Date(filters.startDate.getTime() - periodLength);
      const previousEnd = new Date(filters.endDate.getTime() - periodLength);

      const { count: previousCount, error: previousError } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "pageview")
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());

      if (previousError) throw previousError;

      const current = currentCount || 0;
      const previous = previousCount || 0;
      const change = current - previous;
      const changePercent = previous > 0 ? (change / previous) * 100 : 0;

      return { current, previous, change, changePercent } as StatsData;
    },
  });
};

export const useTimelineData = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "timeline", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("created_at, session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const grouped = (data || []).reduce((acc, event) => {
        const date = format(new Date(event.created_at), "yyyy-MM-dd");
        if (!acc[date]) {
          acc[date] = { pageviews: 0, sessions: new Set() };
        }
        acc[date].pageviews++;
        acc[date].sessions.add(event.session_id);
        return acc;
      }, {} as Record<string, { pageviews: number; sessions: Set<string> }>);

      return Object.entries(grouped).map(([date, data]) => ({
        date,
        pageviews: data.pageviews,
        visitors: data.sessions.size,
      }));
    },
  });
};

export const useDeviceStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "devices", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("device_type, session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const grouped = (data || []).reduce((acc, event) => {
        const device = event.device_type || "unknown";
        if (!acc[device]) acc[device] = new Set();
        acc[device].add(event.session_id);
        return acc;
      }, {} as Record<string, Set<string>>);

      return Object.entries(grouped).map(([name, sessions]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: sessions.size,
      }));
    },
  });
};

export const useTopPages = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "topPages", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("page_path, page_title")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const grouped = (data || []).reduce((acc, event) => {
        const path = event.page_path;
        if (!acc[path]) {
          acc[path] = { count: 0, title: event.page_title || path };
        }
        acc[path].count++;
        return acc;
      }, {} as Record<string, { count: number; title: string }>);

      return Object.entries(grouped)
        .map(([path, data]) => ({
          path,
          title: data.title,
          views: data.count,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
    },
  });
};

export const useCountryStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "countries", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("country, session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const grouped = (data || []).reduce((acc, event) => {
        const country = event.country || "Unknown";
        if (!acc[country]) acc[country] = new Set();
        acc[country].add(event.session_id);
        return acc;
      }, {} as Record<string, Set<string>>);

      return Object.entries(grouped)
        .map(([name, sessions]) => ({
          name,
          value: sessions.size,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    },
  });
};

export const useBrowserStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "browsers", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("browser, session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const grouped = (data || []).reduce((acc, event) => {
        const browser = event.browser || "Unknown";
        if (!acc[browser]) acc[browser] = new Set();
        acc[browser].add(event.session_id);
        return acc;
      }, {} as Record<string, Set<string>>);

      return Object.entries(grouped)
        .map(([name, sessions]) => ({
          name,
          value: sessions.size,
        }))
        .sort((a, b) => b.value - a.value);
    },
  });
};

export const useOSStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "os", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("os, session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const grouped = (data || []).reduce((acc, event) => {
        const os = event.os || "Unknown";
        if (!acc[os]) acc[os] = new Set();
        acc[os].add(event.session_id);
        return acc;
      }, {} as Record<string, Set<string>>);

      return Object.entries(grouped)
        .map(([name, sessions]) => ({
          name,
          value: sessions.size,
        }))
        .sort((a, b) => b.value - a.value);
    },
  });
};

export const useUSStateStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "usStates", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("region, session_id")
        .eq("event_type", "pageview")
        .eq("country", "United States")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const grouped = (data || []).reduce((acc, event) => {
        const state = event.region || "Unknown";
        if (!acc[state]) acc[state] = new Set();
        acc[state].add(event.session_id);
        return acc;
      }, {} as Record<string, Set<string>>);

      return Object.entries(grouped)
        .map(([name, sessions]) => ({
          name,
          value: sessions.size,
        }))
        .sort((a, b) => b.value - a.value);
    },
  });
};

export const useAvgTimeOnPage = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "avgTimeOnPage", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("time_on_page")
        .eq("event_type", "page_exit")
        .not("time_on_page", "is", null)
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const periodLength = filters.endDate.getTime() - filters.startDate.getTime();
      const previousStart = new Date(filters.startDate.getTime() - periodLength);
      const previousEnd = new Date(filters.endDate.getTime() - periodLength);

      const { data: prevData } = await supabase
        .from("analytics_events")
        .select("time_on_page")
        .eq("event_type", "page_exit")
        .not("time_on_page", "is", null)
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());

      const times = (data || []).map((e) => e.time_on_page as number);
      const prevTimes = (prevData || []).map((e) => e.time_on_page as number);

      const current = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
      const previous = prevTimes.length > 0 ? Math.round(prevTimes.reduce((a, b) => a + b, 0) / prevTimes.length) : 0;
      const change = current - previous;
      const changePercent = previous > 0 ? (change / previous) * 100 : 0;

      return { current, previous, change, changePercent } as StatsData;
    },
  });
};

export const useBounceRate = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "bounceRate", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const periodLength = filters.endDate.getTime() - filters.startDate.getTime();
      const previousStart = new Date(filters.startDate.getTime() - periodLength);
      const previousEnd = new Date(filters.endDate.getTime() - periodLength);

      const { data: prevData } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "pageview")
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());

      const calcBounce = (events: { session_id: string }[]) => {
        const sessionCounts = (events || []).reduce((acc, e) => {
          acc[e.session_id] = (acc[e.session_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const total = Object.keys(sessionCounts).length;
        const bounced = Object.values(sessionCounts).filter((c) => c === 1).length;
        return total > 0 ? (bounced / total) * 100 : 0;
      };

      const current = parseFloat(calcBounce(data || []).toFixed(1));
      const previous = parseFloat(calcBounce(prevData || []).toFixed(1));
      const change = current - previous;
      const changePercent = previous > 0 ? (change / previous) * 100 : 0;

      return { current, previous, change, changePercent } as StatsData;
    },
  });
};

export const useAcquisitionStats = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "acquisition", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("session_id, utm_source, utm_medium, utm_campaign, referrer")
        .eq("event_type", "pageview")
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // First touch per session
      const seen = new Set<string>();
      const firstTouch: typeof data = [];
      for (const e of data || []) {
        if (!seen.has(e.session_id)) {
          seen.add(e.session_id);
          firstTouch.push(e);
        }
      }

      const sourceMap: Record<string, number> = {};
      const utmMap: Record<string, { source: string; medium: string; visitors: number }> = {};

      for (const e of firstTouch) {
        let source = "Direto";
        if (e.utm_source) {
          const s = e.utm_source.toLowerCase();
          if (s.includes("google") || s.includes("bing") || s.includes("yahoo")) source = "Busca Orgânica";
          else if (s.includes("facebook") || s.includes("instagram") || s.includes("twitter") || s.includes("linkedin")) source = "Social";
          else source = e.utm_source;
        } else if (e.referrer) {
          const r = e.referrer.toLowerCase();
          if (r.includes("google") || r.includes("bing") || r.includes("yahoo")) source = "Busca Orgânica";
          else if (r.includes("facebook") || r.includes("instagram") || r.includes("twitter") || r.includes("linkedin")) source = "Social";
          else if (r !== "") source = "Referência";
        }

        sourceMap[source] = (sourceMap[source] || 0) + 1;

        if (e.utm_campaign) {
          const key = `${e.utm_source}|${e.utm_medium}|${e.utm_campaign}`;
          if (!utmMap[key]) {
            utmMap[key] = { source: e.utm_source || "", medium: e.utm_medium || "", visitors: 0 };
          }
          utmMap[key].visitors++;
        }
      }

      const sources = Object.entries(sourceMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const utmCampaigns = Object.entries(utmMap).map(([key, val]) => ({
        campaign: key.split("|")[2],
        source: val.source,
        medium: val.medium,
        visitors: val.visitors,
      })).sort((a, b) => b.visitors - a.visitors);

      return { sources, utmCampaigns };
    },
  });
};

export const usePagePerformance = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["analytics", "pagePerformance", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("page_path, page_title, event_type, time_on_page, scroll_depth")
        .in("event_type", ["pageview", "page_exit"])
        .gte("created_at", filters.startDate.toISOString())
        .lte("created_at", filters.endDate.toISOString());

      if (error) throw error;

      const pageMap: Record<string, { title: string; views: number; times: number[]; scrolls: number[] }> = {};

      for (const e of data || []) {
        if (!pageMap[e.page_path]) {
          pageMap[e.page_path] = { title: e.page_title || e.page_path, views: 0, times: [], scrolls: [] };
        }
        if (e.event_type === "pageview") {
          pageMap[e.page_path].views++;
          if (e.page_title) pageMap[e.page_path].title = e.page_title;
        }
        if (e.event_type === "page_exit") {
          if (e.time_on_page != null) pageMap[e.page_path].times.push(e.time_on_page);
          if (e.scroll_depth != null) pageMap[e.page_path].scrolls.push(e.scroll_depth);
        }
      }

      return Object.entries(pageMap)
        .map(([path, d]) => ({
          path,
          title: d.title,
          views: d.views,
          avgTime: d.times.length > 0 ? Math.round(d.times.reduce((a, b) => a + b, 0) / d.times.length) : null,
          avgScroll: d.scrolls.length > 0 ? Math.round(d.scrolls.reduce((a, b) => a + b, 0) / d.scrolls.length) : null,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 20);
    },
  });
};
