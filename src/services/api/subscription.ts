import { apiFetch } from "@/lib/api-client";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import { siteConfig } from "@/config/site";
import {
  SubscriptionStatus,
  PlansResponse,
  UpgradeRequest,
  UpgradeResponse,
  UserSubscriptionResponse,
} from "@/types/subscription";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const subscriptionApi = {
  // Get current subscription status
  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/subscription-status/`,
      {
        method: "GET",
        headers: {
          ...createHeaders(),
          Authorization: `Bearer ${getAuthToken()}`,
        },
        cache: "no-store",
      }
    );

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
    const payload = {
      plan_id: data.plan_id,
      transaction_id: data.transaction_id,
      payment_type: data.payment_type,
    };

    const response = await apiFetch(`${API_BASE_URL}/api/upgrade/`, {
      method: "POST",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });

    await handleApiError(response);
    return response.json();
  },

  // Cancel subscription
  cancel: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/subscription/cancel/`,
      {
        method: "POST",
        headers: {
          ...createHeaders(),
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Get user subscriptions (Subscription History)
  getUserSubscriptions: async (page = 1): Promise<UserSubscriptionResponse> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/user-subscription/?page=${page}`,
      {
        method: "GET",
        headers: {
          ...createHeaders(),
          Authorization: `Bearer ${getAuthToken()}`,
        },
        cache: "no-store",
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Superadmin: Get all user subscriptions
  getAllSubscriptions: async (
    page = 1,
    search = ""
  ): Promise<UserSubscriptionResponse> => {
    let url = `${API_BASE_URL}/api/admin-subscription/?page=${page}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await apiFetch(url, {
      method: "GET",

      cache: "no-store",
    });

    await handleApiError(response);
    return response.json();
  },
};
