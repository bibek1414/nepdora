import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/services/api/owner-sites/admin/customer-profile";
import { ProfileFormValues } from "@/schemas/customer/profile.form";
import { toast } from "sonner";
import { getAuthTokenCustomer } from "@/utils/auth";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getProfile(),
    enabled: !!getAuthTokenCustomer(),
    staleTime: 5 * 60 * 1000, // 5 minutes (reduce redundant calls)
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProfileFormValues>) =>
      profileApi.updateProfile(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(response.message || "Profile updated successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};
