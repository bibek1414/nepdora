// services/api/super-admin/domain.ts
import { siteConfig } from "@/config/site";
import { Domain, PaginatedResponse } from "@/types/super-admin/domain";

const API_BASE_URL = siteConfig.apiBaseUrl;

/**
 * Fetch paginated domains
 * @param page Current page number
 * @param pageSize Number of items per page
 */
export async function getDomains(
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<Domain>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/domains/?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Next.js caching control
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch domains: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching domains:", error);
    throw error;
  }
}
