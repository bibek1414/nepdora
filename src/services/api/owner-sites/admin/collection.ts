import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import {
  Collection,
  Collections,
  CollectionData,
  CollectionDataListResponse,
  CreateCollectionDataInput,
  CreateCollectionInput,
  UpdateCollectionDataInput,
  UpdateCollectionInput,
} from "@/types/owner-site/admin/collection";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const collectionAPI = {
  // Collection Management
  getCollections: async (): Promise<Collections> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/`);

    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  getCollection: async (slug: string): Promise<Collection> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/`);

    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  createCollection: async (
    collectionData: CreateCollectionInput
  ): Promise<Collection> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/`);

    const response = await apiFetch(url.toString(), {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(collectionData),
    });

    await handleApiError(response);
    return await response.json();
  },

  updateCollection: async (
    slug: string,
    collectionData: UpdateCollectionInput
  ): Promise<Collection> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/`);

    const response = await apiFetch(url.toString(), {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(collectionData),
    });

    await handleApiError(response);
    return await response.json();
  },

  deleteCollection: async (slug: string): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/`);

    const response = await apiFetch(url.toString(), {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
  },

  // Collection Data Management
  getCollectionData: async (
    slug: string,
    filters?: Record<string, string>
  ): Promise<CollectionDataListResponse> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/data/`);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  getCollectionDataItem: async (
    slug: string,
    id: number
  ): Promise<CollectionData> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/data/${id}/`);

    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  createCollectionData: async (
    slug: string,
    dataInput: CreateCollectionDataInput
  ): Promise<CollectionData> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/data/`);

    const response = await apiFetch(url.toString(), {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(dataInput),
    });

    await handleApiError(response);
    return await response.json();
  },

  updateCollectionData: async (
    slug: string,
    id: number,
    dataInput: UpdateCollectionDataInput
  ): Promise<CollectionData> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/data/${id}/`);

    const response = await apiFetch(url.toString(), {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(dataInput),
    });

    await handleApiError(response);
    return await response.json();
  },

  deleteCollectionData: async (slug: string, id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/collections/${slug}/data/${id}/`);

    const response = await apiFetch(url.toString(), {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
  },
};
