import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  SuperAdminPaymentSummary,
  CentralPaymentHistory,
  TenantTransfer,
  CreateTransferRequest,
} from "@/types/super-admin/payment";
import { PaginatedResponse } from "@/types/super-admin/user";

export const superAdminPaymentApi = {
  getPaymentSummary: async (
    tenant?: string
  ): Promise<SuperAdminPaymentSummary> => {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams();
    if (tenant && tenant !== "all") params.append("tenant", tenant);

    const response = await apiFetch(
      `${API_BASE_URL}/api/payment-summary/?${params}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  getCentralPayments: async (params?: {
    tenant?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<CentralPaymentHistory>> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();
    if (params?.tenant && params.tenant !== "all")
      queryParams.append("tenant", params.tenant);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());

    const response = await apiFetch(
      `${API_BASE_URL}/api/tenant-central-payments/?${queryParams}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  getTransferHistory: async (params?: {
    tenant?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<TenantTransfer>> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();
    if (params?.tenant && params.tenant !== "all")
      queryParams.append("tenant", params.tenant);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());

    const response = await apiFetch(
      `${API_BASE_URL}/api/tenant-transfers/?${queryParams}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  createTransfer: async (
    data: CreateTransferRequest
  ): Promise<TenantTransfer> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/tenant-transfers/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  updateCentralPaymentStatus: async (
    id: number,
    status: "pending" | "transferred"
  ): Promise<CentralPaymentHistory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(
      `${API_BASE_URL}/api/tenant-central-payments/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    await handleApiError(response);
    return response.json();
  },
};
