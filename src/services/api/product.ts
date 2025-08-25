import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
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

export const productApi = {
  getProducts: async (
    params: PaginationParams = {}
  ): Promise<GetProductsResponse> => {
    const { page = 1, limit = 10, search, sortBy, sortOrder = "asc" } = params;
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) queryParams.append("search", search);
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
    const results = data.results || [];
    const count = data.count || 0;
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

  getProduct: async (slug: string): Promise<Product> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${slug}/`, {
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
    const formData = new FormData();

    // Dynamically append fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/product/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product created successfully",
    };
  },

  updateProduct: async (
    slug: string,
    data: UpdateProductRequest
  ): Promise<UpdateProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const formData = new FormData();

    // Dynamically append fields to FormData for PATCH
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/product/${slug}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product updated successfully",
    };
  },

  deleteProduct: async (slug: string): Promise<DeleteProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${slug}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Product deleted successfully",
    };
  },
};
