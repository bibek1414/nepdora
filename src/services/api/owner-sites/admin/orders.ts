import { getApiBaseUrl } from "@/config/site";
import { createHeaders, createHeadersCustomer } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateOrderRequest,
  Order,
  OrdersResponse,
  OrderPaginationParams,
  UpdateOrderStatusRequest,
  UpdateOrderPaymentRequest,
} from "@/types/owner-site/admin/orders";

export const orderApi = {
  createOrder: async (
    orderData: CreateOrderRequest,
    includeToken: boolean = false
  ): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();

    const headers = includeToken
      ? createHeadersCustomer()
      : {
          "Content-Type": "application/json",
        };

    const response = await fetch(`${API_BASE_URL}/api/admin-order/`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });
    await handleApiError(response);
    return response.json();
  },

  getOrders: async (
    params: OrderPaginationParams = {}
  ): Promise<OrdersResponse> => {
    const { page = 1, page_size = 10, search, status, is_manual } = params;
    const API_BASE_URL = getApiBaseUrl();

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search) queryParams.append("search", search);
    if (status && status !== "all") queryParams.append("status", status);
    if (is_manual) queryParams.append("is_manual", "true");

    const response = await fetch(
      `${API_BASE_URL}/api/admin-order/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  getOrderById: async (id: number): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/admin-order/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  updateOrderStatus: async (
    id: number,
    statusData: UpdateOrderStatusRequest
  ): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(statusData),
    });
    await handleApiError(response);
    return response.json();
  },

  // New method to update order payment information
  updateOrderPayment: async (
    id: number,
    paymentData: UpdateOrderPaymentRequest
  ): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(paymentData),
    });
    await handleApiError(response);
    return response.json();
  },
};
