import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { whatsappApi } from "@/services/api/owner-sites/whatsapp";
import {
  WhatsApp,
  CreateWhatsAppRequest,
  UpdateWhatsAppRequest,
} from "@/types/owner-site/whatsapp";

// Query Keys
export const whatsappKeys = {
  all: ["whatsapp"] as const,
  lists: () => [...whatsappKeys.all, "list"] as const,
  list: (filters: string) => [...whatsappKeys.lists(), { filters }] as const,
  details: () => [...whatsappKeys.all, "detail"] as const,
  detail: (id: string) => [...whatsappKeys.details(), id] as const,
};

// Get all WhatsApp configs
export const useWhatsApps = () => {
  return useQuery({
    queryKey: whatsappKeys.lists(),
    queryFn: whatsappApi.getWhatsApps,
  });
};

// Get single WhatsApp config
export const useWhatsApp = (id: string) => {
  return useQuery({
    queryKey: whatsappKeys.detail(id),
    queryFn: () => whatsappApi.getWhatsApp(id),
    enabled: !!id,
  });
};

// Create WhatsApp config
export const useCreateWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWhatsAppRequest) =>
      whatsappApi.createWhatsApp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whatsappKeys.lists() });
    },
  });
};

// Update WhatsApp config
export const useUpdateWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWhatsAppRequest }) =>
      whatsappApi.updateWhatsApp(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: whatsappKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: whatsappKeys.detail(variables.id),
      });
    },
  });
};

// Delete WhatsApp config
export const useDeleteWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => whatsappApi.deleteWhatsApp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whatsappKeys.lists() });
    },
  });
};
