import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetThemeResponse,
  CreateThemeRequest,
  CreateThemeResponse,
  UpdateThemeRequest,
  UpdateThemeResponse,
} from "@/types/super-admin/components/theme";
import { siteConfig } from "@/config/site";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const useThemeApi = {
  // Get themes with template slug
  getThemes: async (templateSlug: string): Promise<GetThemeResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-theme/${templateSlug}/theme/`,
      {
        method: "GET",
        headers: createHeaders(),
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

  // Get published themes
  getThemesPublished: async (
    templateSlug: string
  ): Promise<GetThemeResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-theme/${templateSlug}/theme/`,
      {
        method: "GET",
        headers: createHeaders(),
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

  // Create theme
  createTheme: async (
    templateSlug: string,
    data: CreateThemeRequest
  ): Promise<CreateThemeResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-theme/${templateSlug}/theme/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Theme created successfully",
    };
  },

  // Update theme
  updateTheme: async (
    templateSlug: string,
    componentId: string,
    data: UpdateThemeRequest
  ): Promise<UpdateThemeResponse> => {
    const requestBody = {
      data: data.data,
    };

    const response = await fetch(
      `${API_BASE_URL}/api/template-theme/${templateSlug}/theme/${componentId}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(requestBody),
      }
    );

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Theme updated successfully",
    };
  },
};
