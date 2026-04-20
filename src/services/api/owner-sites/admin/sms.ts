import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  SMSBalance,
  SMSPurchaseHistory,
  SMSHistory,
  CreateSMSPurchaseRequest,
  UpdateSMSPurchaseRequest,
  PaginatedResponse,
  SendSMSRequest,
  SendSMSResponse,
} from "@/types/owner-site/admin/sms";

export const smsApi = {
  // Get SMS balance
  getBalance: async (): Promise<SMSBalance> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/balance/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // List SMS credit purchases
  getPurchases: async (page: number = 1): Promise<PaginatedResponse<SMSPurchaseHistory>> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/purchases/?page=${page}`, {
      method: "GET",
      // User specified no authentication for GET/list, but we'll include headers for X-Tenant
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create SMS credit purchase
  createPurchase: async (
    data: CreateSMSPurchaseRequest
  ): Promise<SMSPurchaseHistory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/purchases/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Get single purchase detail
  getPurchase: async (id: number | string): Promise<SMSPurchaseHistory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/purchases/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Update purchase (patch)
  patchPurchase: async (
    id: number | string,
    data: UpdateSMSPurchaseRequest
  ): Promise<SMSPurchaseHistory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/purchases/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // List SMS sending history
  getHistory: async (page: number = 1): Promise<PaginatedResponse<SMSHistory>> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/history/?page=${page}`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Send SMS
  sendSMS: async (data: SendSMSRequest): Promise<SendSMSResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/send-sms/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    // For send-sms, we might want to handle common error codes gracefully in the UI
    // so we don't always call handleApiError which might throw and trigger global error handling
    if (!response.ok) {
      try {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.error || errorData.message || "Failed to send SMS",
          error: errorData.error,
        };
      } catch {
        return {
          success: false,
          message: "An unexpected error occurred",
        };
      }
    }
    return response.json();
  },
};
