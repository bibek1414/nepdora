import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { heroApi } from "@/services/api/owner-sites/components/hero";
import {
  CreateHeroRequest,
  UpdateHeroRequest,
  HeroComponentData,
  GetPageComponentsResponse,
  CreateHeroResponse,
  UpdateHeroResponse,
  DeleteHeroResponse,
} from "@/types/owner-site/components/hero";
import { toast } from "sonner";

export const usePageComponentsQuery = (slug: string) => {
  return useQuery<GetPageComponentsResponse>({
    queryKey: ["pageComponents", slug],
    queryFn: () => heroApi.getPageComponents(slug),
    enabled: !!slug,
  });
};

export const useCreateHeroMutation = (slug: string) => {
  const queryClient = useQueryClient();
  return useMutation<CreateHeroResponse, Error, CreateHeroRequest>({
    mutationFn: (data: CreateHeroRequest) => heroApi.createHero(slug, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", slug] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create hero component.");
    },
  });
};

export const useUpdateHeroMutation = (slug: string, componentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<UpdateHeroResponse, Error, UpdateHeroRequest>({
    mutationFn: (data: UpdateHeroRequest) =>
      heroApi.updateHero(slug, componentId, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", slug] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hero component.");
    },
  });
};

export const useDeleteHeroMutation = (slug: string) => {
  const queryClient = useQueryClient();
  return useMutation<DeleteHeroResponse, Error, string>({
    mutationFn: (componentId: string) => heroApi.deleteHero(slug, componentId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", slug] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete hero component.");
    },
  });
};
