import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  Issue,
  IssueCategory,
  CreateIssueCategoryRequest,
  UpdateIssueCategoryRequest,
  CreateIssueRequest,
  UpdateIssueRequest,
  CreateIssueCategoryResponse,
  UpdateIssueCategoryResponse,
  DeleteIssueCategoryResponse,
  GetIssueCategoryResponse,
  CreateIssueResponse,
  UpdateIssueResponse,
  DeleteIssueResponse,
  GetIssueResponse,
} from "@/types/owner-site/issues";

export const issuesApi = {
  // Issue Categories
  getIssueCategories: async (): Promise<IssueCategory[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/issue-category/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getIssueCategory: async (id: number): Promise<GetIssueCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/issue-category/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createIssueCategory: async (
    data: CreateIssueCategoryRequest
  ): Promise<CreateIssueCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/issue-category/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  updateIssueCategory: async (
    id: number,
    data: UpdateIssueCategoryRequest
  ): Promise<UpdateIssueCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/issue-category/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  deleteIssueCategory: async (
    id: number
  ): Promise<DeleteIssueCategoryResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/issue-category/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return { success: true, message: "Issue category deleted successfully" };
  },

  // Issues
  getIssues: async (): Promise<Issue[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/issue/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  getIssue: async (id: number): Promise<GetIssueResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/issue/${id}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createIssue: async (
    data: CreateIssueRequest
  ): Promise<CreateIssueResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/issue/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  updateIssue: async (
    id: number,
    data: UpdateIssueRequest
  ): Promise<UpdateIssueResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/issue/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },

  deleteIssue: async (id: number): Promise<DeleteIssueResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/issue/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return { success: true, message: "Issue deleted successfully" };
  },
};
