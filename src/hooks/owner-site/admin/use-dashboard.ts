import { useQuery } from "@tanstack/react-query";
import * as dashboardService from "@/services/api/owner-sites/admin/dashboard";
import { DashboardStats } from "@/types/owner-site/admin/dashboard";

export const useDashboardStats = (options: any = {}) => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: dashboardService.getDashboardStats,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
