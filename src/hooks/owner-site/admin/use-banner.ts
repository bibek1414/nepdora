import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bannerApi } from "@/services/api/owner-sites/admin/banner";
import { UpdateBannerWithImagesRequest } from "@/types/owner-site/admin/banner";

export const useBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: bannerApi.getBanners,
  });
};

export const useBanner = (id: number) => {
  return useQuery({
    queryKey: ["banner", id],
    queryFn: () => bannerApi.getBanner(id),
    enabled: !!id,
  });
};

export const useCreateBannerWithImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannerApi.createBannerWithImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};

export const useUpdateBannerWithImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateBannerWithImagesRequest;
    }) => bannerApi.updateBannerWithImages(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      queryClient.invalidateQueries({ queryKey: ["banner", id] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannerApi.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
