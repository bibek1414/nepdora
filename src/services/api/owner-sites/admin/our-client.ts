import {
  OurClient,
  OurClientFormData,
  OurClientFilters,
} from "@/types/owner-site/admin/our-client";
import { getApiBaseUrl } from "@/config/site";

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
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch our clients: ${response.status}`);
    }

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

    const response = await fetch(`${BASE_API_URL}/api/our-client/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create our client: ${response.status}`);
    }

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

    const response = await fetch(`${BASE_API_URL}/api/our-client/${id}/`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update our client: ${response.status}`);
    }

    return await response.json();
  },

  deleteOurClient: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(`${BASE_API_URL}/api/our-client/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete our client: ${response.status}`);
    }
  },
};
