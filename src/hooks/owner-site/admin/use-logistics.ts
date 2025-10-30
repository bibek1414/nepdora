import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logisticsApi } from "@/services/api/owner-sites/admin/logistics";
import {
  CreateLogisticsRequest,
  UpdateLogisticsRequest,
} from "@/types/owner-site/admin/logistics";

// Query Keys
export const logisticsKeys = {
  all: ["logistics"] as const,
  lists: () => [...logisticsKeys.all, "list"] as const,
  list: (filters: string) => [...logisticsKeys.lists(), { filters }] as const,
  dash: () => [...logisticsKeys.all, "dash"] as const,
  ydm: () => [...logisticsKeys.all, "ydm"] as const,
  details: () => [...logisticsKeys.all, "detail"] as const,
  detail: (id: string) => [...logisticsKeys.details(), id] as const,
};

// Get all logistics configs
export const useLogistics = () => {
  return useQuery({
    queryKey: logisticsKeys.lists(),
    queryFn: logisticsApi.getLogistics,
  });
};

// Get Dash logistics
export const useLogisticsDash = () => {
  return useQuery({
    queryKey: logisticsKeys.dash(),
    queryFn: logisticsApi.getLogisticsDash,
  });
};

// Get YDM logistics
export const useLogisticsYDM = () => {
  return useQuery({
    queryKey: logisticsKeys.ydm(),
    queryFn: logisticsApi.getLogisticsYDM,
  });
};

// Get single logistics config
export const useLogistic = (id: string) => {
  return useQuery({
    queryKey: logisticsKeys.detail(id),
    queryFn: () => logisticsApi.getLogistic(id),
    enabled: !!id,
  });
};

// Create logistics config
export const useCreateLogistics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLogisticsRequest) =>
      logisticsApi.createLogistics(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logisticsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: logisticsKeys.dash() }); // ← Invalidate both
      queryClient.invalidateQueries({ queryKey: logisticsKeys.ydm() });
    },
  });
};

// Update logistics config
export const useUpdateLogistics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLogisticsRequest }) =>
      logisticsApi.updateLogistics(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: logisticsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: logisticsKeys.dash() }); // ← Invalidate both
      queryClient.invalidateQueries({ queryKey: logisticsKeys.ydm() });
      queryClient.invalidateQueries({
        queryKey: logisticsKeys.detail(variables.id),
      });
    },
  });
};

// Delete logistics config
export const useDeleteLogistics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => logisticsApi.deleteLogistics(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logisticsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: logisticsKeys.dash() });
      queryClient.invalidateQueries({ queryKey: logisticsKeys.ydm() });
    },
  });
};
