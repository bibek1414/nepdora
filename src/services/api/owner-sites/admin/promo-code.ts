import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetPromoCodesResponse,
  CreatePromoCodeRequest,
  CreatePromoCodeResponse,
  UpdatePromoCodeRequest,
  UpdatePromoCodeResponse,
  DeletePromoCodeResponse,
  PromoCode,
  PaginationParams,
} from "@/types/owner-site/admin/promo-code";

export const usePromoCodeApi = {
  getPromoCodes: async (
    params: PaginationParams = {}
  ): Promise<GetPromoCodesResponse> => {
    const { page = 1, page_size = 10, search } = params;

    const API_BASE_URL = getApiBaseUrl();

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/promocode/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    const data = await response.json();

    // Enhanced response transformation
    const results = Array.isArray(data) ? data : data.results || [];
    const count = data.count || data.length || 0;
    const totalPages = Math.ceil(count / page_size);

    return {
      results,
      count,
      next: data.next || null,
      previous: data.previous || null,
      pagination: {
        page,
        page_size,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  },

  getPromoCode: async (id: number): Promise<PromoCode> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/promocode/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createPromoCode: async (
    data: CreatePromoCodeRequest
  ): Promise<CreatePromoCodeResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/promocode/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Promo code created successfully",
    };
  },

  updatePromoCode: async (
    id: number,
    data: UpdatePromoCodeRequest
  ): Promise<UpdatePromoCodeResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/promocode/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Promo code updated successfully",
    };
  },

  deletePromoCode: async (id: number): Promise<DeletePromoCodeResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/promocode/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Promo code deleted successfully",
    };
  },
};
