import { apiFetch } from "@/lib/api-client";
import { siteConfig } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  VideoTestimonial,
  VideoTestimonialResponse,
  CreateVideoTestimonialData,
  UpdateVideoTestimonialData,
} from "@/types/super-admin/video-testimonial";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const videoTestimonialsApi = {
  // Get all video testimonials
  getAll: async (): Promise<VideoTestimonial[]> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/support/video-testimonial/`,
      {
        method: "GET",
        headers: createHeaders(),
        skipTenantDomain: true,
      } as any
    );

    await handleApiError(response);
    const data: VideoTestimonialResponse = await response.json();
    return data.results;
  },

  // Get video testimonial by ID
  getById: async (id: number): Promise<VideoTestimonial> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/support/video-testimonial/${id}/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Create new video testimonial
  create: async (data: CreateVideoTestimonialData): Promise<VideoTestimonial> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/support/video-testimonial/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Update existing video testimonial
  update: async (
    id: number,
    data: UpdateVideoTestimonialData
  ): Promise<VideoTestimonial> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/support/video-testimonial/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(data),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Delete video testimonial
  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiFetch(
      `${API_BASE_URL}/api/support/video-testimonial/${id}/`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return { success: true, message: "Video testimonial deleted successfully" };
  },
};
