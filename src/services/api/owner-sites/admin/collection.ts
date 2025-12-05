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
import { handleApiError } from "@/utils/api-error";

export const collectionAPI = {
  // Collection Management
  getCollections: async (): Promise<Collections> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/collections/`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch collections");
    }
  },

  getCollection: async (slug: string): Promise<Collection> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/collections/${slug}/`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch collection");
    }
  },

  createCollection: async (
    collectionData: CreateCollectionInput
  ): Promise<Collection> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/collections/`);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectionData),
      }).catch(fetchError => {
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create collection error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create collection");
    }
  },

  updateCollection: async (
    slug: string,
    collectionData: UpdateCollectionInput
  ): Promise<Collection> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/collections/${slug}/`);

      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectionData),
      }).catch(fetchError => {
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update collection error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update collection");
    }
  },

  deleteCollection: async (slug: string): Promise<void> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/collections/${slug}/`);

      const response = await fetch(url.toString(), {
        method: "DELETE",
      }).catch(fetchError => {
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
    } catch (error) {
      console.error("Delete collection error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete collection");
    }
  },

  // Collection Data Management
  getCollectionData: async (
    slug: string,
    filters?: Record<string, string>
  ): Promise<CollectionDataListResponse> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/collections/${slug}/data/`);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch collection data");
    }
  },

  getCollectionDataItem: async (
    slug: string,
    id: number
  ): Promise<CollectionData> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(
        `${BASE_API_URL}/api/collections/${slug}/data/${id}/`
      );

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch collection data item");
    }
  },

  createCollectionData: async (
    slug: string,
    dataInput: CreateCollectionDataInput
  ): Promise<CollectionData> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/collections/${slug}/data/`);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataInput),
      }).catch(fetchError => {
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create collection data error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create collection data");
    }
  },

  updateCollectionData: async (
    slug: string,
    id: number,
    dataInput: UpdateCollectionDataInput
  ): Promise<CollectionData> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(
        `${BASE_API_URL}/api/collections/${slug}/data/${id}/`
      );

      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataInput),
      }).catch(fetchError => {
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update collection data error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update collection data");
    }
  },

  deleteCollectionData: async (slug: string, id: number): Promise<void> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(
        `${BASE_API_URL}/api/collections/${slug}/data/${id}/`
      );

      const response = await fetch(url.toString(), {
        method: "DELETE",
      }).catch(fetchError => {
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
    } catch (error) {
      console.error("Delete collection data error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete collection data");
    }
  },
};
