import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetFooterResponse,
  CreateFooterRequest,
  CreateFooterResponse,
  UpdateFooterRequest,
  UpdateFooterResponse,
  DeleteFooterResponse,
} from "@/types/super-admin/components/footer";
import { siteConfig } from "@/config/site";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const useFooterApi = {
  // Get footer with template slug
  getFooter: async (templateSlug: string): Promise<GetFooterResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-footer/${templateSlug}/footer/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Footer retrieved successfully" : "No footer found",
    };
  },

  // Get published footer
  getFooterPublished: async (
    templateSlug: string
  ): Promise<GetFooterResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-footer/${templateSlug}/footer/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Footer retrieved successfully" : "No footer found",
    };
  },

  // Create footer
  createFooter: async (
    templateSlug: string,
    data: CreateFooterRequest
  ): Promise<CreateFooterResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-footer/${templateSlug}/footer/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({
          component_id: data.component_id,
          content: data.content,
          data: data.footerData,
        }),
      }
    );

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Footer created successfully",
    };
  },

  // Update footer
  updateFooter: async (
    templateSlug: string,
    componentId: string,
    data: UpdateFooterRequest
  ): Promise<UpdateFooterResponse> => {
    console.log(
      "Making PATCH request to:",
      `${API_BASE_URL}/api/template-footer/${templateSlug}/footer/${componentId}/`
    );
    console.log("Update payload:", {
      data: data.footerData,
      ...(data.content && { content: data.content }),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/template-footer/${templateSlug}/footer/${componentId}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify({
          data: data.footerData,
          ...(data.content && { content: data.content }),
        }),
      }
    );

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Footer updated successfully",
    };
  },

  // Delete footer
  deleteFooter: async (
    templateSlug: string,
    componentId: string
  ): Promise<DeleteFooterResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/template-footer/${templateSlug}/footer/${componentId}/`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);

    return {
      message: "Footer deleted successfully",
    };
  },
};
