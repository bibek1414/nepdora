import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templateAPI } from "@/services/api/owner-sites/admin/template";
import {
  PaginatedTemplates,
  TemplateFilters,
  ImportTemplateResponse,
} from "@/types/owner-site/admin/template";
import { toast } from "sonner";

export const useGetTemplates = (filters: TemplateFilters = {}) => {
  return useQuery<PaginatedTemplates>({
    queryKey: ["templates", filters],
    queryFn: () => templateAPI.getTemplates(filters),
  });
};

export const useImportTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ImportTemplateResponse, Error, number>({
    mutationFn: (templateId: number) => {
      return templateAPI.importTemplate(templateId);
    },
    onSuccess: data => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["templates"] });

      console.log("Template imported successfully:", data);
    },
    onError: error => {
      toast.error(error.message || "Failed to import template");
      console.error("Failed to import template:", error);
    },
  });
};

export const usePreviewTemplate = () => {
  return {
    openPreview: (schemaName: string) => {
      const previewUrl = templateAPI.getPreviewUrl(schemaName);
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    },
  };
};
