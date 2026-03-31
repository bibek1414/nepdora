import { apiFetch } from "@/lib/api-client";
import {
  OurClient,
  OurClientFormData,
  OurClientFilters,
} from "@/types/owner-site/admin/our-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders, createHeadersTokenOnly } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const ourClientAPI = {
  getOurClients: async (
    filters: OurClientFilters = {}
  ): Promise<OurClient[]> => {
    const BASE_API_URL = getApiBaseUrl();

    const { search } = filters;

    const url = new URL(`${BASE_API_URL}/api/our-client/`);

    if (search && search.trim()) {
      url.searchParams.append("search", search.trim());
    }
    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();
    return data;
  },

  createOurClient: async (
    clientData: OurClientFormData
  ): Promise<OurClient> => {
    const BASE_API_URL = getApiBaseUrl();
    const formData = new FormData();
    formData.append("name", clientData.name);
    if (clientData.url) {
      formData.append("url", clientData.url);
    }
    if (clientData.logo instanceof File) {
      formData.append("logo", clientData.logo);
    }

    const response = await apiFetch(`${BASE_API_URL}/api/our-client/`, {
      method: "POST",
      headers: createHeadersTokenOnly(),
      body: formData,
    });

    await handleApiError(response);
    return await response.json();
  },

  updateOurClient: async (
    id: number,
    clientData: Partial<OurClientFormData>
  ): Promise<OurClient> => {
    const BASE_API_URL = getApiBaseUrl();
    const formData = new FormData();
    if (clientData.name) formData.append("name", clientData.name);
    if (clientData.url) formData.append("url", clientData.url);
    if (clientData.logo instanceof File) {
      formData.append("logo", clientData.logo);
    }

    const response = await apiFetch(`${BASE_API_URL}/api/our-client/${id}/`, {
      method: "PATCH",
      headers: createHeadersTokenOnly(),
      body: formData,
    });

    await handleApiError(response);
    return await response.json();
  },

  deleteOurClient: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(`${BASE_API_URL}/api/our-client/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
  },
};
