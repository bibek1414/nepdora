import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/services/api/owner-sites/admin/stats";
import { AnalyticsStats } from "@/types/owner-site/admin/stats";

export const useAnalyticsStats = (
  params?: {
    start_date?: string;
    end_date?: string;
    month?: string;
    year?: string | number;
  },
  options: any = {}
) => {
  return useQuery<AnalyticsStats>({
    queryKey: ["analytics-stats", params],
    queryFn: () => statsApi.getAnalyticsStats(params),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    ...options,
  });
};
