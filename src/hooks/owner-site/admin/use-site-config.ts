import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { siteConfigAPI } from "@/services/api/owner-sites/admin/site-config";
import { SiteConfig } from "@/types/owner-site/admin/site-config";
import { useContext } from "react";
import { WebsiteSocketContext } from "@/providers/website-socket-provider";

export const useSiteConfig = () => {
  const socket = useContext(WebsiteSocketContext);

  return useQuery<SiteConfig | null, Error>({
    queryKey: ["site-config"],
    queryFn: () => {
      if (!socket || !socket.enabled) {
        return siteConfigAPI.getSiteConfig();
      }
      return new Promise<SiteConfig | null>((resolve, reject) => {
        const unsubscribe = socket.subscribe("site_config", (message: any) => {
          unsubscribe();
          resolve(message.data as SiteConfig);
        });

        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for site config via WebSocket"));
        }, 10000);

        socket.sendMessage({
          action: "get_site_config",
        });
      });
    },
    staleTime: Infinity, // Never consider stale - data rarely changes
    gcTime: Infinity, // Never remove from cache
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on remount
    refetchOnReconnect: false,
    retry: 3,
    // Keep previous data while fetching
    placeholderData: previousData => previousData,
  });
};

export const useCreateSiteConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      configData,
      accessToken,
    }: {
      configData: FormData;
      accessToken?: string;
    }) => siteConfigAPI.createSiteConfig(configData, accessToken),
    onSuccess: data => {
      // Optimistically update cache
      queryClient.setQueryData(["site-config"], data);
      queryClient.invalidateQueries({ queryKey: ["site-config"] });
    },
  });
};

export const usePatchSiteConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      accessToken,
    }: {
      id: number;
      data: FormData;
      accessToken?: string;
    }) => siteConfigAPI.patchSiteConfig(id, data, accessToken),
    onSuccess: data => {
      // Optimistically update cache
      queryClient.setQueryData(["site-config"], data);
      queryClient.invalidateQueries({ queryKey: ["site-config"] });
    },
  });
};

export const useDeleteSiteConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => siteConfigAPI.deleteSiteConfig(id),
    onSuccess: () => {
      queryClient.setQueryData(["site-config"], null);
      queryClient.invalidateQueries({ queryKey: ["site-config"] });
    },
  });
};
