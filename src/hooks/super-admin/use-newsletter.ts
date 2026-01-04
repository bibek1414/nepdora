import { useQuery } from "@tanstack/react-query";
import { superAdminNewsletterApi } from "@/services/api/super-admin/newsletter";
import { GetNepdoraNewslettersResponse } from "@/types/super-admin/newsletter";

export const useSuperAdminNewsletters = (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  return useQuery<GetNepdoraNewslettersResponse>({
    queryKey: ["super-admin-newsletters", page, pageSize, search],
    queryFn: () => superAdminNewsletterApi.getAll(page, pageSize, search),
  });
};
