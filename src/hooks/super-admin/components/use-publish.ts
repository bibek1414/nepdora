import { useMutation } from "@tanstack/react-query";
import publishSiteApi from "@/services/api/owner-sites/components/publish";
import { toast } from "sonner";

export const usePublishSite = () => {
  return useMutation({
    mutationFn: publishSiteApi,
    onSuccess: () => {
      toast.success("Site published successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.message || "Something went wrong while publishing");
    },
  });
};
