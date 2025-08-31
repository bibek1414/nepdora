import {
  BlogComponentData,
  BlogDisplayData,
} from "@/types/owner-site/components/blog";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export interface CreateBlogComponentRequest {
  component_id: string;
  component_type: "blog";
  data: BlogDisplayData;
  order?: number;
}

export interface UpdateBlogComponentRequest {
  data: BlogDisplayData;
  order?: number;
}

export const blogComponentsApi = {
  // Create blog component
  createBlogComponent: async (
    pageSlug: string,
    payload: CreateBlogComponentRequest
  ): Promise<BlogComponentData> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/pages/${pageSlug}/components/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(payload),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Update blog component
  updateBlogComponent: async (
    pageSlug: string,
    componentId: string,
    payload: UpdateBlogComponentRequest
  ): Promise<BlogComponentData> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/pages/${pageSlug}/components/${componentId}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(payload),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Delete blog component
  deleteBlogComponent: async (
    componentId: string,
    pageSlug: string
  ): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/pages/${pageSlug}/components/${componentId}/`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
  },
};