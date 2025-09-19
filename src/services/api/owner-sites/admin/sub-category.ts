import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import {
  GetSubCategoriesResponse,
  CreateSubCategoryRequest,
  CreateSubCategoryResponse,
  UpdateSubCategoryRequest,
  UpdateSubCategoryResponse,
  DeleteSubCategoryResponse,
  SubCategory,
  PaginationParams,
} from "@/types/owner-site/admin/product";

export const useSubCategoryApi = {
  getSubCategories: async (
    params: PaginationParams = {}
  ): Promise<GetSubCategoriesResponse> => {
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
      `${API_BASE_URL}/api/sub-category/?${queryParams.toString()}`,
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

  getSubCategory: async (slug: string): Promise<SubCategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/sub-category/${slug}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createSubCategory: async (
    data: CreateSubCategoryRequest | FormData
  ): Promise<CreateSubCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    let formData: FormData;

    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/sub-category/`, {
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
      message: "SubCategory created successfully",
    };
  },

  updateSubCategory: async (
    slug: string,
    data: UpdateSubCategoryRequest | FormData
  ): Promise<UpdateSubCategoryResponse> => {
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

    const response = await fetch(`${API_BASE_URL}/api/sub-category/${slug}/`, {
      method: "PATCH",
      headers,
      body,
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "SubCategory updated successfully",
    };
  },

  deleteSubCategory: async (
    slug: string
  ): Promise<DeleteSubCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/sub-category/${slug}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "SubCategory deleted successfully",
    };
  },
};
