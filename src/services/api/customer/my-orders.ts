import { getApiBaseUrl } from "@/config/site";
import { createHeadersCustomer } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  OrderFilters,
  OrdersResponse,
  StatusCounts,
} from "@/types/customer/my-orders";

const buildQueryParams = (filters: OrderFilters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "status" && value === "all") return;
      params.append(key, value.toString());
    }
  });
  return params.toString();
};

export const fetchMyOrders = async (
  filters: OrderFilters = {}
): Promise<OrdersResponse> => {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const queryString = buildQueryParams(filters);
    const url = `${API_BASE_URL}/api/my-order/${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: createHeadersCustomer(), // Using standardized headers
    });

    await handleApiError(response); // Using centralized error handling
    return response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching orders.");
  }
};

export const fetchOrderStatusCounts = async (): Promise<StatusCounts> => {
  try {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/my-order-status/`, {
      method: "GET",
      headers: createHeadersCustomer(), // Using standardized headers
    });

    await handleApiError(response); // Using centralized error handling

    const data = await response.json();

    // Transform API response to match StatusCounts interface
    const statusCounts: StatusCounts = {
      all:
        (data.pending || 0) +
        (data.confirmed || 0) +
        (data.processing || 0) +
        (data.shipped || 0) +
        (data.delivered || 0) +
        (data.cancelled || 0),
      pending: data.pending || 0,
      confirmed: data.confirmed || 0,
      processing: data.processing || 0,
      shipped: data.shipped || 0,
      delivered: data.delivered || 0,
      cancelled: data.cancelled || 0,
    };

    return statusCounts;
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while fetching order status counts."
    );
  }
};
