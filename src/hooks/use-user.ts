import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "@/services/api/user";
import { useAuth } from "@/hooks/use-auth";
import {
  UserProfile,
  UpdateUserProfile,
  ChangePasswordRequest,
} from "@/types/user";

export const useUserProfile = () => {
  const { tokens } = useAuth();

  return useQuery<UserProfile, Error>({
    queryKey: ["user-profile"],
    queryFn: () => userAPI.getProfile(tokens?.access_token),
    enabled: !!tokens?.access_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserProfile = () => {
  const { tokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserProfile) =>
      userAPI.updateProfile(data, tokens?.access_token),
    onSuccess: updatedProfile => {
      queryClient.setQueryData(["user-profile"], updatedProfile);
      // Also invalidate to make sure other components get the fresh data if needed
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

export const useChangePassword = () => {
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      userAPI.changePassword(data, tokens?.access_token),
  });
};
