import { siteConfig } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  TestimonialResponse,
  Testimonial,
  CreateTestimonialData,
  UpdateTestimonialData,
} from "@/types/owner-site/admin/testimonial";
const API_BASE_URL = siteConfig.apiBaseUrl;
const createFormData = (
  data: CreateTestimonialData | UpdateTestimonialData
): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  return formData;
};

export const testimonialsApi = {
  // Get all testimonials
  getAll: async (): Promise<TestimonialResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-testimonial/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Get testimonial by ID
  getById: async (id: number): Promise<Testimonial> => {
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-testimonial/${id}/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Create new testimonial
  create: async (data: CreateTestimonialData): Promise<Testimonial> => {
    const formData = createFormData(data);

    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-testimonial/`,
      {
        method: "POST",
        body: formData,
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Update existing testimonial
  update: async (
    id: number,
    data: UpdateTestimonialData
  ): Promise<Testimonial> => {
    const formData = createFormData(data);

    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-testimonial/${id}/`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Delete testimonial
  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-testimonial/${id}/`,
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
    return { success: true, message: "Testimonial deleted successfully" };
  },
};
