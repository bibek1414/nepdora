import { getApiBaseUrl } from "@/config/site";
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

export const useFooterApi = {
  getFooter: async (): Promise<GetFooterResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/footer/?status=preview`, {
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
  getFooterPublished: async (): Promise<GetFooterResponse> => {
    const API_BASE_URL = getApiBaseUrl();
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

  createFooter: async (
    data: CreateFooterRequest
  ): Promise<CreateFooterResponse> => {
    const API_BASE_URL = getApiBaseUrl();
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

  updateFooter: async (
    data: UpdateFooterRequest
  ): Promise<UpdateFooterResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    console.log("Making PATCH request to:", `${API_BASE_URL}/api/footer/`);
    console.log("Update payload:", {
      id: data.id,
      data: data.footerData,
    });

    const response = await fetch(`${API_BASE_URL}/api/footer/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify({
        id: data.id,
        data: data.footerData, // Use footerData from the request
        ...(data.content && { content: data.content }), // Only include content if provided
      }),
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Footer updated successfully",
    };
  },

  deleteFooter: async (): Promise<DeleteFooterResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/footer/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Footer deleted successfully",
    };
  },
};
