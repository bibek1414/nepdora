import { siteConfig } from "@/config/site";
import { Domain, PaginatedResponse } from "@/types/super-admin/domain";

const API_BASE_URL = siteConfig.apiBaseUrl;

export async function getDomains(
  page = 1,
  pageSize = 10,
  paymentEnabled?: boolean
): Promise<PaginatedResponse<Domain>> {
  try {
    let url = `${API_BASE_URL}/api/domains/?page=${page}&page_size=${pageSize}`;
    if (paymentEnabled) {
      url += "&payment=enabled";
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch domains: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching domains:", error);
    throw error;
  }
}
