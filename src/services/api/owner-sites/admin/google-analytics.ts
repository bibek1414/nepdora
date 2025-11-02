import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GoogleAnalytics,
  CreateGoogleAnalyticsRequest,
  UpdateGoogleAnalyticsRequest,
  CreateGoogleAnalyticsResponse,
  UpdateGoogleAnalyticsResponse,
  DeleteGoogleAnalyticsResponse,
  GetGoogleAnalyticsResponse,
} from "@/types/owner-site/admin/google-analytics";

export const googleAnalyticsApi = {
  // Get all Google Analytics configs
  getGoogleAnalytics: async (): Promise<GoogleAnalytics[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/google-analytic/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Get single Google Analytics config by ID
  getGoogleAnalytic: async (
    id: string
  ): Promise<GetGoogleAnalyticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/google-analytic/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create Google Analytics config
  createGoogleAnalytics: async (
    data: CreateGoogleAnalyticsRequest
  ): Promise<CreateGoogleAnalyticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/google-analytic/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Update Google Analytics config
  updateGoogleAnalytics: async (
    id: string,
    data: UpdateGoogleAnalyticsRequest
  ): Promise<UpdateGoogleAnalyticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/google-analytic/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Delete Google Analytics config
  deleteGoogleAnalytics: async (
    id: string
  ): Promise<DeleteGoogleAnalyticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/google-analytic/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleApiError(response);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return {
      success: true,
      message: "Google Analytics config deleted successfully",
    };
  },
};
