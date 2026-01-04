import { siteConfig } from "@/config/site";
import {
  ContactMessage,
  PaginatedContactResponse,
} from "@/types/super-admin/contact";
import { getAuthToken } from "@/utils/auth";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const superAdminContactApi = {
  getMessages: async (
    page = 1,
    pageSize = 10,
    search = ""
  ): Promise<PaginatedContactResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-contact/?${params}`,
      {
        method: "GET",
        headers: {
          ...createHeaders(),
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    await handleApiError(response);
    return response.json();
  },

  deleteMessage: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-contact/${id}/`,
      {
        method: "DELETE",
        headers: {
          ...createHeaders(),
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    await handleApiError(response);
    return response.json();
  },
};
