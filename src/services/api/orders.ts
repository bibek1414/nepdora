import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateOrderRequest,
  Order,
  OrdersResponse,
} from "@/types/owner-site/orders";

export const orderApi = {
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(orderData),
    });
    await handleApiError(response);
    return response.json();
  },

  getOrders: async (): Promise<OrdersResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  getOrderById: async (id: number): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },
};
