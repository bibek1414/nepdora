import { getApiBaseUrl } from "@/config/site";
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
    const response = await fetch(`${API_BASE_URL}/api/payment-gateway/`, {
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
};
