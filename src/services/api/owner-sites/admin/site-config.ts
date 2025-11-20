import { getApiBaseUrl } from "@/config/site";
import { SiteConfig } from "@/types/owner-site/admin/site-config";
import { handleApiError } from "@/utils/api-error";

export const siteConfigAPI = {
  getSiteConfig: async (): Promise<SiteConfig | null> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/site-config/`);
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      await handleApiError(response);
      const data = await response.json();

      // Handle array response - return first item or null if empty
      if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : null;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch site configuration");
    }
  },

  createSiteConfig: async (
    configData: FormData,
    accessToken?: string
  ): Promise<SiteConfig> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/site-config/`);

      const headers: HeadersInit = {};

      // Add authorization if token provided
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        headers,
        body: configData,
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
      console.error("Create site config error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create site configuration");
    }
  },

  patchSiteConfig: async (
    configId: number,
    configData: FormData,
    accessToken?: string
  ): Promise<SiteConfig> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/site-config/${configId}/`);

      const headers: HeadersInit = {};

      // Add authorization if token provided
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers,
        body: configData,
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
      console.error("Update site config error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update site configuration");
    }
  },

  deleteSiteConfig: async (
    configId: number,
    accessToken?: string
  ): Promise<void> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/site-config/${configId}/`);

      const headers: HeadersInit = {};

      // Add authorization if token provided
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers,
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
      console.error("Delete site config error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete site configuration");
    }
  },
};
