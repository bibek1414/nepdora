import { getApiBaseUrl } from "@/config/site";

export const onboardingAPI = {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  completeOnboarding: async (accessToken: string): Promise<any> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/complete-onboarding/`);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to complete onboarding");
      }

      return await response.json();
    } catch (error) {
      console.error("Complete onboarding error:", error);
      throw error;
    }
  },
};
