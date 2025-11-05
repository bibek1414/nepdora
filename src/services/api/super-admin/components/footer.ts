import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  GetFooterResponse,
  CreateFooterRequest,
  CreateFooterResponse,
  UpdateFooterRequest,
  UpdateFooterResponse,
  DeleteFooterResponse,
} from "@/types/owner-site/components/footer";
import { siteConfig } from "@/config/site";
const API_BASE_URL = siteConfig.apiBaseUrl;
export const useFooterApi = {
  // Get footer with preview status
  getFooter: async (): Promise<GetFooterResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/footer/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Footer retrieved successfully" : "No footer found",
    };
  },

  // Get published footer
  getFooterPublished: async (): Promise<GetFooterResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/footer/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();

    return {
      data: data || null,
      message: data ? "Footer retrieved successfully" : "No footer found",
    };
  },

  // Create footer
  createFooter: async (
    data: CreateFooterRequest
  ): Promise<CreateFooterResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/footer/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        component_id: data.component_id,
        content: data.content,
        data: data.footerData,
      }),
    });

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Footer created successfully",
    };
  },

  // Update footer - ID in URL (RESTful approach)
  updateFooter: async (
    data: UpdateFooterRequest
  ): Promise<UpdateFooterResponse> => {
    console.log(
      "Making PATCH request to:",
      `${API_BASE_URL}/api/footer/${data.id}/`
    );
    console.log("Update payload:", {
      data: data.footerData,
      ...(data.content && { content: data.content }),
    });

    const response = await fetch(`${API_BASE_URL}/api/footer/${data.id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify({
        data: data.footerData,
        ...(data.content && { content: data.content }),
      }),
    });

    await handleApiError(response);
    const responseData = await response.json();

    return {
      data: responseData,
      message: "Footer updated successfully",
    };
  },

  // Delete footer - ID in URL
  deleteFooter: async (id: string): Promise<DeleteFooterResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/footer/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);

    return {
      message: "Footer deleted successfully",
    };
  },
};
