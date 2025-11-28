import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetPricingsResponse,
  CreatePricingRequest,
  CreatePricingResponse,
  UpdatePricingRequest,
  UpdatePricingResponse,
  DeletePricingResponse,
  Pricing,
  PricingQueryParams,
} from "@/types/owner-site/admin/pricing";

export const usePricingApi = {
  getPricings: async (
    params: PricingQueryParams = {}
  ): Promise<GetPricingsResponse> => {
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
      ? `${API_BASE_URL}/api/our-pricing/?${queryString}`
      : `${API_BASE_URL}/api/our-pricing/`;

    const response = await fetch(url, {
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

  getPricing: async (id: number): Promise<Pricing> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/our-pricing/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createPricing: async (
    data: CreatePricingRequest
  ): Promise<CreatePricingResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/our-pricing/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Pricing plan created successfully",
    };
  },

  updatePricing: async (
    id: number,
    data: UpdatePricingRequest
  ): Promise<UpdatePricingResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/our-pricing/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Pricing plan updated successfully",
    };
  },

  deletePricing: async (id: number): Promise<DeletePricingResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/our-pricing/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Pricing plan deleted successfully",
    };
  },
};
