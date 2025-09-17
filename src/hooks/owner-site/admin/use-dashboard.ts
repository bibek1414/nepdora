import { useQuery } from "@tanstack/react-query";
import * as dashboardService from "@/services/api/owner-sites/admin/dashboard";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: dashboardService.getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
};
