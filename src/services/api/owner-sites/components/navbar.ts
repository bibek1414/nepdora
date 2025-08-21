import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetNavbarResponse,
  CreateNavbarRequest,
  CreateNavbarResponse,
  UpdateNavbarRequest,
  UpdateNavbarResponse,
  DeleteNavbarResponse,
  Navbar,
} from "@/types/owner-site/components/navbar";

export const useNavbarApi = {
  getNavbar: async (): Promise<GetNavbarResponse> => {
    const API_BASE_URL = getApiBaseUrl();
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

  createNavbar: async (
    data: CreateNavbarRequest
  ): Promise<CreateNavbarResponse> => {
    const API_BASE_URL = getApiBaseUrl();
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

  updateNavbar: async (
    data: UpdateNavbarRequest
  ): Promise<UpdateNavbarResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/navbar/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify({
        id: data.id,
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

  deleteNavbar: async (id: string): Promise<DeleteNavbarResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/navbar/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Navbar deleted successfully",
    };
  },
};
