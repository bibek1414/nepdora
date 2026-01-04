import { siteConfig } from "@/config/site";
import { ContactMessage } from "@/types/super-admin/contact";
import { getAuthToken } from "@/utils/auth";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const superAdminContactApi = {
  getMessages: async (): Promise<ContactMessage[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-contact`,
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
