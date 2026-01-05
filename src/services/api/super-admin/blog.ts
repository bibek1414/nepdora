import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import {
  BlogPost,
  PaginatedBlogResponse,
  CreateBlogPost,
  UpdateBlogPost,
  BlogTag,
  BlogCategory,
  BlogFilters,
} from "@/types/super-admin/blog";

// New interface for creating tags
export interface CreateBlogTag {
  name: string;
}

const buildBlogFormData = (
  data: CreateBlogPost | UpdateBlogPost | Omit<UpdateBlogPost, "id">
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // Skip null or undefined values
    }

    if (key === "tag_ids" && Array.isArray(value)) {
      value.forEach((id: number) => formData.append("tag_ids", id.toString()));
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === "boolean") {
      formData.append(key, value.toString());
    } else if (typeof value === "number") {
      formData.append(key, value.toString());
    } else if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  return formData;
};

export const superAdminBlogApi = {
  getBlogs: async (filters?: BlogFilters): Promise<PaginatedBlogResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.page_size)
        queryParams.append("page_size", filters.page_size.toString());
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.is_published !== undefined)
        queryParams.append("is_published", filters.is_published.toString());
      if (filters.ordering) queryParams.append("ordering", filters.ordering);
      if (filters.author) queryParams.append("author", filters.author);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => queryParams.append("tags", tag));
      }
    }

    const url = `${API_BASE_URL}/api/nepdora-blogs/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getRecentBlogs: async (): Promise<BlogPost[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-recent-blogs/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();
    return data.results || data;
  },

  getBlogBySlug: async (slug: string): Promise<BlogPost> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-blogs/${slug}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getTags: async (): Promise<BlogTag[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-tags/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    return data.results || data;
  },

  getCategories: async (): Promise<BlogCategory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/nepdora-blog-categories/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return data.results || data;
  },

  createCategory: async (categoryData: {
    name: string;
  }): Promise<BlogCategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/nepdora-blog-categories/`,
      {
        method: "POST",
        headers: {
          ...createHeaders(),
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(categoryData),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  createTag: async (tagData: CreateBlogTag): Promise<BlogTag> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-tags/`, {
      method: "POST",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(tagData),
    });

    await handleApiError(response);
    return response.json();
  },

  create: async (blogData: CreateBlogPost): Promise<BlogPost> => {
    const API_BASE_URL = getApiBaseUrl();
    const formData = buildBlogFormData(blogData);

    const response = await fetch(`${API_BASE_URL}/api/nepdora-blogs/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // Don't set Content-Type header - let the browser set it with boundary
      },
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  update: async (
    slug: string,
    blogData: Omit<UpdateBlogPost, "id">
  ): Promise<BlogPost> => {
    const API_BASE_URL = getApiBaseUrl();
    const formData = buildBlogFormData(blogData);

    const response = await fetch(`${API_BASE_URL}/api/nepdora-blogs/${slug}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // Don't set Content-Type header - let the browser set it with boundary
      },
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  delete: async (slug: string): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-blogs/${slug}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    await handleApiError(response);
  },

  updateCategory: async (
    slug: string,
    categoryData: { name: string }
  ): Promise<BlogCategory> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/nepdora-blog-categories/${slug}/`,
      {
        method: "PATCH",
        headers: {
          ...createHeaders(),
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(categoryData),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  deleteCategory: async (slug: string): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/nepdora-blog-categories/${slug}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    await handleApiError(response);
  },

  updateTag: async (slug: string, tagData: CreateBlogTag): Promise<BlogTag> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-tags/${slug}/`, {
      method: "PATCH",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(tagData),
    });

    await handleApiError(response);
    return response.json();
  },

  deleteTag: async (slug: string): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/nepdora-tags/${slug}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    await handleApiError(response);
  },
};
