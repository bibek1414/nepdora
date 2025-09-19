import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateOrderRequest,
  Order,
  OrdersResponse,
  OrderPaginationParams,
  UpdateOrderStatusRequest,
} from "@/types/owner-site/admin/orders";

export const orderApi = {
  createOrder: async (
    orderData: CreateOrderRequest,
    isAuthenticated: boolean = false
  ): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/`, {
      method: "POST",
      headers: createHeaders(isAuthenticated),
      body: JSON.stringify(orderData),
    });
    await handleApiError(response);
    return response.json();
  },

  getOrders: async (
    params: OrderPaginationParams = {},
    isAuthenticated: boolean = true
  ): Promise<OrdersResponse> => {
    const { page = 1, page_size = 10, search, status, sortBy } = params;
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search) queryParams.append("search", search);
    if (status && status !== "all") queryParams.append("status", status);

    const response = await fetch(
      `${API_BASE_URL}/api/order/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: createHeaders(isAuthenticated),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  getOrderById: async (
    id: number,
    isAuthenticated: boolean = true
  ): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/${id}/`, {
      method: "GET",
      headers: createHeaders(isAuthenticated),
    });
    await handleApiError(response);
    return response.json();
  },

  updateOrderStatus: async (
    id: number,
    statusData: UpdateOrderStatusRequest,
    isAuthenticated: boolean = true
  ): Promise<Order> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/order/${id}/`, {
      method: "PATCH",
      headers: createHeaders(isAuthenticated),
      body: JSON.stringify(statusData),
    });
    await handleApiError(response);
    return response.json();
  },
};
