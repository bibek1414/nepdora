import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  Logistics,
  CreateLogisticsRequest,
  UpdateLogisticsRequest,
  CreateLogisticsResponse,
  UpdateLogisticsResponse,
  DeleteLogisticsResponse,
  GetLogisticsResponse,
} from "@/types/owner-site/admin/logistics";

export const logisticsApi = {
  // Get all logistics configs
  getLogistics: async (): Promise<Logistics[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/logistics/list/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Get Dash logistics
  getLogisticsDash: async (): Promise<Logistics[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/logistics/?logistic=Dash`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Get YDM logistics
  getLogisticsYDM: async (): Promise<Logistics[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/logistics/?logistic=YDM`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Get single logistics config by ID
  getLogistic: async (id: string): Promise<GetLogisticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/logistics/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create logistics config
  createLogistics: async (
    data: CreateLogisticsRequest
  ): Promise<CreateLogisticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/logistics/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Update logistics config
  updateLogistics: async (
    id: string,
    data: UpdateLogisticsRequest
  ): Promise<UpdateLogisticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/logistics/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Delete logistics config
  deleteLogistics: async (id: string): Promise<DeleteLogisticsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/logistics/${id}/`, {
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
      message: "Logistics config deleted successfully",
    };
  },
};
