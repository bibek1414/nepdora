import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/services/api/owner-sites/admin/stats";

export const useUnreadCounts = () => {
  return useQuery({
    queryKey: ["unread-counts"],
    queryFn: statsApi.getUnreadCounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
