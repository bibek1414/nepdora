import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTemplateApi } from "@/services/api/super-admin/components/template";
import {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "@/types/super-admin/components/template";

export const useTemplates = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["templates", page, pageSize],
    queryFn: () => useTemplateApi.getTemplates(page, pageSize),
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
