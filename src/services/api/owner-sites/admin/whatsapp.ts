import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  WhatsApp,
  CreateWhatsAppRequest,
  UpdateWhatsAppRequest,
  CreateWhatsAppResponse,
  UpdateWhatsAppResponse,
  DeleteWhatsAppResponse,
  GetWhatsAppResponse,
} from "@/types/owner-site/admin/whatsapp";

export const whatsappApi = {
  // Get all whatsapp configs
  getWhatsApps: async (): Promise<WhatsApp[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/whatsapp/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Get single whatsapp config by ID
  getWhatsApp: async (id: string): Promise<GetWhatsAppResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/whatsapp/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create whatsapp config
  createWhatsApp: async (
    data: CreateWhatsAppRequest
  ): Promise<CreateWhatsAppResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/whatsapp/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Update whatsapp config
  updateWhatsApp: async (
    id: string,
    data: UpdateWhatsAppRequest
  ): Promise<UpdateWhatsAppResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/whatsapp/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Delete whatsapp config
  deleteWhatsApp: async (id: string): Promise<DeleteWhatsAppResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/whatsapp/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleApiError(response);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return { success: true, message: "WhatsApp config deleted successfully" };
  },
};
