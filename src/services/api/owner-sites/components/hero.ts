import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetPageComponentsResponse,
  CreateHeroRequest,
  CreateHeroResponse,
  UpdateHeroRequest,
  UpdateHeroResponse,
  DeleteHeroResponse,
} from "@/types/owner-site/components/hero";

const API_BASE_URL = getApiBaseUrl();

export const heroApi = {
  getPageComponents: async (
    slug: string
  ): Promise<GetPageComponentsResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${slug}/components/`,
        {
          method: "GET",
          headers: createHeaders(),
        }
      );

      await handleApiError(response);
      const responseData = await response.json();
      console.log("Fetched components data:", responseData);
      console.log(`${API_BASE_URL}/api/pages/${slug}/components/`);

      // Your API returns an array directly, so we need to handle this
      if (Array.isArray(responseData)) {
        return {
          success: true,
          message: "Components fetched successfully",
          data: responseData,
          components: responseData,
        };
      }

      // Fallback for other response formats
      return {
        success: responseData.success || true,
        message: responseData.message || "Components fetched successfully",
        data: responseData.data || responseData.components || [],
        components: responseData.components || responseData.data || [],
      };
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(
        `Failed to fetch components: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  createHero: async (
    slug: string,
    heroData: CreateHeroRequest
  ): Promise<CreateHeroResponse> => {
    try {
      // Ensure the payload includes all required fields
      const payload = {
        component_id: heroData.component_id || Date.now().toString(),
        component_type: "hero",
        data: heroData.data,
        order: heroData.order || 0,
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
        message: data.message || "Hero component created successfully",
        data: data.data || data,
      };
    } catch (error) {
      throw new Error(
        `Failed to create hero component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  updateHero: async (
    slug: string,
    componentId: string,
    heroData: UpdateHeroRequest
  ): Promise<UpdateHeroResponse> => {
    try {
      // Ensure the payload includes the component_type
      const payload = {
        component_type: "hero",
        data: heroData.data,
        ...(heroData.order !== undefined && { order: heroData.order }),
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
        message: data.message || "Hero component updated successfully",
        data: data.data || data,
      };
    } catch (error) {
      throw new Error(
        `Failed to update hero component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  deleteHero: async (
    slug: string,
    componentId: string
  ): Promise<DeleteHeroResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${slug}/components/${componentId}/`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      await handleApiError(response);
      const data = await response.json();

      return {
        success: data.success ?? true,
        message: data.message || "Hero component deleted successfully",
      };
    } catch (error) {
      throw new Error(
        `Failed to delete hero component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
