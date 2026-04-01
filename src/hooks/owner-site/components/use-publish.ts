import { useMutation } from "@tanstack/react-query";
import publishSiteApi from "@/services/api/owner-sites/components/publish";
import { toast } from "sonner";
import { revalidatePublishCache } from "@/lib/actions/publish-revalidation";

export const usePublishSite = (siteUser?: string) => {
  return useMutation({
    mutationFn: publishSiteApi,
    onSuccess: async () => {
      if (siteUser) {
        await revalidatePublishCache(siteUser);
      }
      toast.success("Site published successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.message || "Something went wrong while publishing");
    },
  });
};
