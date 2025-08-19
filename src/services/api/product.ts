import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetProductsResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
  Product,
  PaginationParams,
} from "@/types/owner-site/product";

export const useProductApi = {
  getProducts: async (
    params: PaginationParams = {}
  ): Promise<GetProductsResponse> => {
    const { page = 1, limit = 10, search, sortBy, sortOrder = "asc" } = params;

    const API_BASE_URL = getApiBaseUrl();

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    if (sortBy) {
      queryParams.append("sort_by", sortBy);
      queryParams.append("sort_order", sortOrder);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/product/?${queryParams.toString()}`,
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
    const totalPages = Math.ceil(count / limit);

    return {
      results,
      count,
      next: data.next || null,
      previous: data.previous || null,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  },

  getProduct: async (id: number): Promise<Product> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createProduct: async (
    data: CreateProductRequest
  ): Promise<CreateProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product created successfully",
    };
  },

  updateProduct: async (
    id: number,
    data: UpdateProductRequest
  ): Promise<UpdateProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product updated successfully",
    };
  },

  deleteProduct: async (id: number): Promise<DeleteProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Product deleted successfully",
    };
  },
};
