import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetNavbarResponse,
  CreateNavbarRequest,
  CreateNavbarResponse,
  UpdateNavbarRequest,
  UpdateNavbarResponse,
  DeleteNavbarResponse,
} from "@/types/super-admin/components/navbar";
import { siteConfig } from "@/config/site";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const useNavbarApi = {
  // Get navbar with template slug
  getNavbar: async (templateSlug: string): Promise<GetNavbarResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-navbar/${templateSlug}/navbar/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Navbar retrieved successfully" : "No navbar found",
    };
  },

  // Get published navbar
  getNavbarPublished: async (
    templateSlug: string
  ): Promise<GetNavbarResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-navbar/${templateSlug}/navbar/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Navbar retrieved successfully" : "No navbar found",
    };
  },

  // Create navbar
  createNavbar: async (
    templateSlug: string,
    data: CreateNavbarRequest
  ): Promise<CreateNavbarResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-navbar/${templateSlug}/navbar/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({
          component_id: data.component_id,
          content: data.content,
          data: data.navbarData,
        }),
      }
    );

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Navbar created successfully",
    };
  },

  // Update navbar
  updateNavbar: async (
    templateSlug: string,
    componentId: string,
    data: UpdateNavbarRequest
  ): Promise<UpdateNavbarResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-navbar/${templateSlug}/navbar/${componentId}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify({
          data: data.navbarData,
          ...(data.content && { content: data.content }),
        }),
      }
    );

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Navbar updated successfully",
    };
  },

  // Delete navbar
  deleteNavbar: async (
    templateSlug: string,
    componentId: string
  ): Promise<DeleteNavbarResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-navbar/${templateSlug}/navbar/${componentId}/`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);

    return {
      message: "Navbar deleted successfully",
    };
  },
};
