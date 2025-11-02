import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateFacebookIntegrationRequest,
  CreateFacebookIntegrationResponse,
  UpdateFacebookIntegrationRequest,
  UpdateFacebookIntegrationResponse,
  DeleteFacebookIntegrationResponse,
  FacebookIntegration,
} from "@/types/owner-site/admin/facebook";

export const useFacebookApi = {
  getFacebookIntegrations: async (): Promise<FacebookIntegration[]> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/facebook/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    return data;
  },

  getFacebookIntegration: async (id: number): Promise<FacebookIntegration> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/facebook/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createFacebookIntegration: async (
    data: CreateFacebookIntegrationRequest
  ): Promise<CreateFacebookIntegrationResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/facebook/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Facebook integration created successfully",
    };
  },

  updateFacebookIntegration: async (
    id: number,
    data: UpdateFacebookIntegrationRequest
  ): Promise<UpdateFacebookIntegrationResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/facebook/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Facebook integration updated successfully",
    };
  },

  deleteFacebookIntegration: async (
    id: number
  ): Promise<DeleteFacebookIntegrationResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/facebook/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Facebook integration deleted successfully",
    };
  },
};
