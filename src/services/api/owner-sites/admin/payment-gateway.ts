import { getApiBaseUrl, siteConfig } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  PaymentGateway,
  CreatePaymentGatewayRequest,
  UpdatePaymentGatewayRequest,
  CreatePaymentGatewayResponse,
  UpdatePaymentGatewayResponse,
  DeletePaymentGatewayResponse,
  GetPaymentGatewayResponse,
  PaymentHistoryListResponse,
  TenantCentralPaymentListResponse,
  PaymentSummary,
  PaymentHistory,
  TenantCentralPayment,
} from "@/types/owner-site/admin/payment-gateway";

export const paymentGatewayApi = {
  // Get all payment gateway configs
  getPaymentGateways: async (): Promise<PaymentGateway[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/payment-gateway/list/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },
  getPaymentGatewayKhalti: async (): Promise<PaymentGateway[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/payment-gateway/?payment_type=khalti`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },
  getPaymentGatewayEsewa: async (): Promise<PaymentGateway[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/payment-gateway/?payment_type=esewa`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Get single payment gateway config by ID
  getPaymentGateway: async (id: string): Promise<GetPaymentGatewayResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/payment-gateway/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create payment gateway config
  createPaymentGateway: async (
    data: CreatePaymentGatewayRequest
  ): Promise<CreatePaymentGatewayResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/payment-gateway/list/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Update payment gateway config
  updatePaymentGateway: async (
    id: string,
    data: UpdatePaymentGatewayRequest
  ): Promise<UpdatePaymentGatewayResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/payment-gateway/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    await handleApiError(response);
    return response.json();
  },

  // Delete payment gateway config
  deletePaymentGateway: async (
    id: string
  ): Promise<DeletePaymentGatewayResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/payment-gateway/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleApiError(response);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return {
      success: true,
      message: "Payment gateway config deleted successfully",
    };
  },

  // Get payment history from the tenant's own gateway
  getPaymentHistory: async (params: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaymentHistoryListResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await fetch(
      `${API_BASE_URL}/api/payment-gateway/history/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Get central payments for this tenant
  getTenantCentralPayments: async (params: {
    tenant: string;
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<TenantCentralPaymentListResponse> => {
    const CENTRAL_API_URL = siteConfig.apiBaseUrl;
    const queryParams = new URLSearchParams();
    queryParams.append("tenant", params.tenant);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await fetch(
      `${CENTRAL_API_URL}/api/tenant-central-payments/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Get payment summary from central for this tenant
  getPaymentSummary: async (tenant: string): Promise<PaymentSummary> => {
    const CENTRAL_API_URL = siteConfig.apiBaseUrl;
    const response = await fetch(
      `${CENTRAL_API_URL}/api/payment-summary/?tenant=${tenant}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Update payment history (mark as read)
  updatePaymentHistory: async (
    id: number,
    data: { is_read: boolean }
  ): Promise<PaymentHistory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/payment-gateway/history/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Update central payment (mark as read)
  updateTenantCentralPayment: async (
    id: number,
    data: { is_read: boolean }
  ): Promise<TenantCentralPayment> => {
    const CENTRAL_API_URL = siteConfig.apiBaseUrl;
    const response = await fetch(
      `${CENTRAL_API_URL}/api/tenant-central-payments/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );
    await handleApiError(response);
    return response.json();
  },
};
