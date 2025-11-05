// hooks/superadmin/components/use-templates.ts
import { useQuery } from "@tanstack/react-query";
import { useTemplateApi } from "@/services/api/super-admin/template";

export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const templates = await useTemplateApi.getTemplates();
      return templates;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
