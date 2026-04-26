import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetPricingMetricsResponse,
  CreatePricingMetricRequest,
  CreatePricingMetricResponse,
  UpdatePricingMetricRequest,
  UpdatePricingMetricResponse,
  DeletePricingMetricResponse,
  PricingMetric,
  PricingMetricQueryParams,
} from "@/types/owner-site/admin/pricing-metric";

export const usePricingMetricApi = {
  getPricingMetrics: async (
    params: PricingMetricQueryParams = {}
  ): Promise<GetPricingMetricsResponse> => {
    const { search, sortBy, sortOrder = "asc" } = params;

    const API_BASE_URL = getApiBaseUrl();

    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append("search", search);
    }

    if (sortBy) {
      queryParams.append(
        "ordering",
        sortOrder === "desc" ? `-${sortBy}` : sortBy
      );
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/api/pricing-metric/?${queryString}`
      : `${API_BASE_URL}/api/pricing-metric/`;

    const response = await apiFetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    const results = Array.isArray(data) ? data : data.results || [];
    const count = data.count || data.length || 0;

    return {
      results,
      count,
    };
  },

  getPricingMetric: async (id: number): Promise<PricingMetric> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/pricing-metric/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createPricingMetric: async (
    data: CreatePricingMetricRequest
  ): Promise<CreatePricingMetricResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await apiFetch(`${API_BASE_URL}/api/pricing-metric/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Pricing metric created successfully",
    };
  },

  updatePricingMetric: async (
    id: number,
    data: UpdatePricingMetricRequest
  ): Promise<UpdatePricingMetricResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await apiFetch(`${API_BASE_URL}/api/pricing-metric/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Pricing metric updated successfully",
    };
  },

  deletePricingMetric: async (id: number): Promise<DeletePricingMetricResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/pricing-metric/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Pricing metric deleted successfully",
    };
  },
};
