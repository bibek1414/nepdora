import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetNavbarResponse,
  CreateNavbarRequest,
  CreateNavbarResponse,
  UpdateNavbarRequest,
  UpdateNavbarResponse,
  DeleteNavbarResponse,
} from "@/types/owner-site/components/navbar";
import { siteConfig } from "@/config/site";
const API_BASE_URL = siteConfig.apiBaseUrl;
export const useNavbarApi = {
  // Get navbar with preview status
  getNavbar: async (): Promise<GetNavbarResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/navbar/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Navbar retrieved successfully" : "No navbar found",
    };
  },

  // Get published navbar
  getNavbarPublished: async (): Promise<GetNavbarResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/navbar/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Navbar retrieved successfully" : "No navbar found",
    };
  },

  // Create navbar
  createNavbar: async (
    data: CreateNavbarRequest
  ): Promise<CreateNavbarResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/navbar/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        component_id: data.component_id,
        content: data.content,
        data: data.navbarData,
      }),
    });

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Navbar created successfully",
    };
  },

  // Update navbar - ID in URL (RESTful approach)
  updateNavbar: async (
    data: UpdateNavbarRequest
  ): Promise<UpdateNavbarResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/navbar/${data.id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify({
        data: data.navbarData,
      }),
    });

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Navbar updated successfully",
    };
  },

  // Delete navbar - ID in URL
  deleteNavbar: async (id: string): Promise<DeleteNavbarResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/navbar/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);

    return {
      message: "Navbar deleted successfully",
    };
  },
};
