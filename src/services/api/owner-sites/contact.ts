import {
  Contact,
  ContactFormData,
  PaginatedContacts,
  ContactFilters,
} from "@/types/owner-site/contact";
import { getApiBaseUrl } from "@/config/site";

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
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.status}`);
    }

    return await response.json();
  },

  createContact: async (contactData: ContactFormData): Promise<Contact> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(`${BASE_API_URL}/api/contact/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...contactData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create contact: ${response.status}`);
    }

    return await response.json();
  },
};
