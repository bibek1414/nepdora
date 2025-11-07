import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import { siteConfig } from "@/config/site";
import {
  SubscriptionStatus,
  PlansResponse,
  UpgradeRequest,
  UpgradeResponse,
} from "@/types/subscription";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const subscriptionApi = {
  // Get current subscription status
  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await fetch(`${API_BASE_URL}/api/subscription-status/`, {
      method: "GET",
      headers: {
        ...createHeaders(),
        Authorization: `Bearer ${getAuthToken()}`,
      },
      cache: "no-store",
    });

    await handleApiError(response);
    return response.json();
  },

  // Get available pricing plans - using your existing API
  getPlans: async (): Promise<PlansResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/plans/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
  },

  // Upgrade/Subscribe to a plan
  upgrade: async (data: UpgradeRequest): Promise<UpgradeResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/upgrade/`, {
      method: "POST",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  // Cancel subscription
  cancel: async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/subscription/cancel/`, {
      method: "POST",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    await handleApiError(response);
    return response.json();
  },
};
