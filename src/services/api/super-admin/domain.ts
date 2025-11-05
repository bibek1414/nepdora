import { siteConfig } from "@/config/site";
import { Domain, PaginatedResponse } from "@/types/super-admin/domain";

const API_BASE_URL = siteConfig.apiBaseUrl;

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
        cache: "no-store",
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
