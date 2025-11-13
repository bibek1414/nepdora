import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTemplateApi } from "@/services/api/super-admin/components/template";
import {
  Template,
  CreateTemplateRequest,
} from "@/types/super-admin/components/template";

export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => useTemplateApi.getTemplates(),
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

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ownerId: number) => useTemplateApi.deleteTemplate(ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};
