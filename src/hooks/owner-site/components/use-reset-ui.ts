import { ResetUi } from "@/services/api/owner-sites/components/reset-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useResetUi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ResetUi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({ queryKey: ["theme"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Site reset successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.message || "Something went wrong while resetting");
    },
  });
};
