"use client";

import { servicesApi } from "@/services/api/owner-sites/admin/services";
import {
  ServicesPost,
  PaginatedServicesResponse,
  ServicesFilters,
  CreateServicesPost,
  UpdateServicesPost,
} from "@/types/owner-site/admin/services";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export const servicesKeys = {
  all: ["services"] as const,
  lists: () => [...servicesKeys.all, "list"] as const,
  list: (filters: ServicesFilters) =>
    [...servicesKeys.lists(), filters] as const,
  details: () => [...servicesKeys.all, "detail"] as const,
  detail: (slug: string) => [...servicesKeys.details(), slug] as const,
};

export const useServices = (
  filters?: ServicesFilters,
  options?: Omit<
    UseQueryOptions<PaginatedServicesResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<PaginatedServicesResponse, Error>({
    queryKey: servicesKeys.list(filters || {}),
    queryFn: () => servicesApi.getServices(filters),
    ...options,
  });
};

export const useService = (
  slug: string,
  options?: Omit<UseQueryOptions<ServicesPost, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<ServicesPost, Error>({
    queryKey: servicesKeys.detail(slug),
    queryFn: () => servicesApi.getServiceBySlug(slug),
    enabled: !!slug,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    ...options,
  });
};

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceData }: { serviceData: CreateServicesPost }) =>
      servicesApi.create(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.lists() });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      serviceData,
    }: {
      slug: string;
      serviceData: Omit<UpdateServicesPost, "id">;
    }) => servicesApi.update(slug, serviceData),
    onSuccess: updatedService => {
      queryClient.setQueryData(
        servicesKeys.detail(updatedService.slug),
        updatedService
      );
      queryClient.invalidateQueries({ queryKey: servicesKeys.lists() });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => servicesApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
  });
}
