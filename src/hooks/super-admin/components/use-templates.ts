import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTemplateApi } from "@/services/api/super-admin/components/template";
import {
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "@/types/super-admin/components/template";

interface UseTemplatesParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  subcategory?: string;
}
export const useTemplates = ({
  page = 1,
  pageSize = 10,
  category,
  subcategory,
  search,
}: UseTemplatesParams = {}) => {
  return useQuery({
    queryKey: ["templates", page, pageSize, category, subcategory, search],
    queryFn: () =>
      useTemplateApi.getTemplates(
        page,
        pageSize,
        category,
        subcategory,
        search
      ),
    placeholderData: previousData => previousData,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTemplateRequest) =>
      useTemplateApi.createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ownerId,
      payload,
    }: {
      ownerId: number | string;
      payload: UpdateTemplateRequest;
    }) => useTemplateApi.updateTemplate(ownerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error: Error) => {
      console.error("Update template error:", error);
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ownerId: number) => useTemplateApi.deleteTemplate(ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};
