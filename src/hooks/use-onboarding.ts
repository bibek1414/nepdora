import { useMutation } from "@tanstack/react-query";
import { onboardingAPI } from "@/services/auth/onboarding";

export const useCompleteOnboarding = () => {
  return useMutation({
    mutationFn: (accessToken: string) =>
      onboardingAPI.completeOnboarding(accessToken),
  });
};
