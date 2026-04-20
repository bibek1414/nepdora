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
  getPurchases: async (): Promise<SMSPurchaseHistory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/purchases/`, {
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
  getHistory: async (): Promise<SMSHistory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/sms/history/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },
};
