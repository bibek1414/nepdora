import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateAboutUsRequest,
  CreateAboutUsResponse,
  UpdateAboutUsRequest,
  UpdateAboutUsResponse,
  DeleteAboutUsResponse,
} from "@/types/owner-site/components/about";

const API_BASE_URL = getApiBaseUrl();

export const aboutApi = {
  createAboutUs: async (
    slug: string,
    aboutData: CreateAboutUsRequest
  ): Promise<CreateAboutUsResponse> => {
    try {
      const payload = {
        component_id: aboutData.component_id || `about-${Date.now()}`,
        component_type: "about",
        data: aboutData.data,
        order: aboutData.order || 0,
      };
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${slug}/components/`,
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(payload),
        }
      );

      await handleApiError(response);
      const data = await response.json();
      return {
        success: data.success || true,
        message: data.message || "About Us component created successfully",
        data: data.data || data,
      };
    } catch (error) {
      throw new Error(
        `Failed to create About Us component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  updateAboutUs: async (
    slug: string,
    componentId: string,
    aboutData: UpdateAboutUsRequest
  ): Promise<UpdateAboutUsResponse> => {
    try {
      const payload = {
        component_type: "about",
        data: aboutData.data,
        ...(aboutData.order !== undefined && { order: aboutData.order }),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/pages/${slug}/components/${componentId}/`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(payload),
        }
      );

      await handleApiError(response);
      const data = await response.json();
      return {
        success: data.success || true,
        message: data.message || "About Us component updated successfully",
        data: data.data || data,
      };
    } catch (error) {
      throw new Error(
        `Failed to update About Us component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  deleteAboutUs: async (
    slug: string,
    componentId: string
  ): Promise<DeleteAboutUsResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${slug}/components/${componentId}/`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      await handleApiError(response);
      return {
        success: true,
        message: "About Us component deleted successfully",
      };
    } catch (error) {
      throw new Error(
        `Failed to delete About Us component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
