import { apiFetch } from "@/lib/api-client";
import {
  Contact,
  ContactFormData,
  PaginatedContacts,
  ContactFilters,
} from "@/types/owner-site/admin/contact";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const contactAPI = {
  getContacts: async (
    filters: ContactFilters = {}
  ): Promise<PaginatedContacts> => {
    const BASE_API_URL = getApiBaseUrl();

    const { page = 1, page_size = 10, search } = filters;

    const url = new URL(`${BASE_API_URL}/api/contact/`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("page_size", page_size.toString());

    if (search && search.trim()) {
      url.searchParams.append("search", search.trim());
    }
    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  createContact: async (contactData: ContactFormData): Promise<Contact> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(`${BASE_API_URL}/api/contact/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        ...contactData,
      }),
    });

    await handleApiError(response);
    return await response.json();
  },

  updateContact: async (
    id: number,
    data: Partial<Contact>
  ): Promise<Contact> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(`${BASE_API_URL}/api/contact/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return await response.json();
  },

  deleteContact: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(`${BASE_API_URL}/api/contact/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
  },
};
