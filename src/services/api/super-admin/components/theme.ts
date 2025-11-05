import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetThemeResponse,
  CreateThemeRequest,
  CreateThemeResponse,
  UpdateThemeRequest,
  UpdateThemeResponse,
} from "@/types/owner-site/components/theme";
import { siteConfig } from "@/config/site";
const API_BASE_URL = siteConfig.apiBaseUrl;
export const useThemeApi = {
  getThemes: async (): Promise<GetThemeResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/theme/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || [],
      message:
        data?.length > 0 ? "Themes retrieved successfully" : "No themes found",
    };
  },
  getThemesPublished: async (): Promise<GetThemeResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/theme/`, {
      method: "GET",
      headers: createHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/api/theme/`, {
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
    const requestBody = {
      data: data.data,
    };

    const response = await fetch(`${API_BASE_URL}/api/theme/${data.id}/`, {
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
