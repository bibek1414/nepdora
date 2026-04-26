import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetThemeResponse,
  CreateThemeRequest,
  CreateThemeResponse,
  UpdateThemeRequest,
  UpdateThemeResponse,
} from "@/types/owner-site/components/theme";

export const useThemeApi = {
  getThemes: async (
    status: string = "preview",
    options?: RequestInit
  ): Promise<GetThemeResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(
      `${API_BASE_URL}/api/theme/?status=${status}`,
      {
        method: "GET",
        headers: createHeaders(),
        ...options,
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || [],
      message:
        data?.length > 0 ? "Themes retrieved successfully" : "No themes found",
    };
  },
  getThemesPublished: async (options?: RequestInit): Promise<GetThemeResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/theme/`, {
      method: "GET",
      headers: createHeaders(),
      ...options,
    });

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || [],
      message:
        data?.length > 0 ? "Themes retrieved successfully" : "No themes found",
    };
  },

  createTheme: async (
    data: CreateThemeRequest
  ): Promise<CreateThemeResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/theme/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Theme created successfully",
    };
  },

  updateTheme: async (
    data: UpdateThemeRequest
  ): Promise<UpdateThemeResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const requestBody = {
      data: data.data,
    };

    const response = await apiFetch(`${API_BASE_URL}/api/theme/${data.id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(requestBody),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Theme updated successfully",
    };
  },
};
