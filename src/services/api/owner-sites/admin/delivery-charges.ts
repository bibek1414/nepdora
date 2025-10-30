import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  DeliveryChargesResponse,
  UpdateDeliveryChargeRequest,
  DefaultDeliveryCharge,
  DeliveryChargeError,
  CreateDeliveryChargeRequest,
} from "@/types/owner-site/admin/delivery-charges";

export const deliveryChargesApi = {
  // Get default delivery charges
  getDefaultDeliveryCharges: async (): Promise<{
    default_price: DefaultDeliveryCharge[];
  }> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/default-delivery-charges/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Update default delivery charges
  updateDefaultDeliveryCharges: async (
    id: number,
    data: Omit<DefaultDeliveryCharge, "id" | "location_name" | "is_default">
  ): Promise<DefaultDeliveryCharge> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/delivery-charges/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData: DeliveryChargeError = await response.json();
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
      const firstError = Object.values(errorData)[0];
      if (Array.isArray(firstError)) {
        throw new Error(firstError[0]);
      }
      await handleApiError(response);
    }

    return response.json();
  },

  // Get all delivery charges with pagination and search
  getDeliveryCharges: async (
    page: number = 1,
    page_size: number = 50,
    search?: string
  ): Promise<DeliveryChargesResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("page_size", page_size.toString());
    if (search) {
      params.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/delivery-charges/?${params.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Load default values
  loadDefaultValues: async (): Promise<DeliveryChargesResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/delivery-charges/load-default/`,
      {
        method: "POST",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Update delivery charge
  updateDeliveryCharge: async (
    data: UpdateDeliveryChargeRequest
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    const API_BASE_URL = getApiBaseUrl();
    const { id, ...updateData } = data;
    const response = await fetch(
      `${API_BASE_URL}/api/delivery-charges/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData: DeliveryChargeError = await response.json();
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
      const firstError = Object.values(errorData)[0];
      if (Array.isArray(firstError)) {
        throw new Error(firstError[0]);
      }
      await handleApiError(response);
    }

    return response.json();
  },

  // Create new delivery charge
  createDeliveryCharge: async (
    data: CreateDeliveryChargeRequest
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/delivery-charges/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: DeliveryChargeError = await response.json();
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
      const firstError = Object.values(errorData)[0];
      if (Array.isArray(firstError)) {
        throw new Error(firstError[0]);
      }
      await handleApiError(response);
    }

    return response.json();
  },
};
