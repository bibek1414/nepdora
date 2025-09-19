import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import {
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  Category,
  PaginationParams,
} from "@/types/owner-site/admin/product";

export const useCategoryApi = {
  getCategories: async (
    params: PaginationParams = {}
  ): Promise<GetCategoriesResponse> => {
    const {
      page = 1,
      page_size = 10,
      search,
      sortBy,
      sortOrder = "asc",
    } = params;

    const API_BASE_URL = getApiBaseUrl();

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    if (sortBy) {
      queryParams.append("sort_by", sortBy);
      queryParams.append("sort_order", sortOrder);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/category/?${queryParams.toString()}`,
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

  getCategory: async (slug: string): Promise<Category> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/category/${slug}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createCategory: async (
    data: CreateCategoryRequest | FormData
  ): Promise<CreateCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    let formData: FormData;

    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/category/`, {
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
      message: "Category created successfully",
    };
  },

  updateCategory: async (
    slug: string,
    data: UpdateCategoryRequest | FormData
  ): Promise<UpdateCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    let body: BodyInit;
    let headers: HeadersInit = {};

    if (data instanceof FormData) {
      body = data;
      headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };
    } else {
      body = JSON.stringify(data);
      headers = createHeaders();
    }

    const response = await fetch(`${API_BASE_URL}/api/category/${slug}/`, {
      method: "PATCH",
      headers,
      body,
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Category updated successfully",
    };
  },

  deleteCategory: async (slug: string): Promise<DeleteCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/category/${slug}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Category deleted successfully",
    };
  },
};
