import {
  CustomerFilters,
  PaginatedCustomers,
} from "@/types/owner-site/admin/customer";
import { getApiBaseUrl } from "@/config/site";

export const customerAPI = {
  getRegisteredCustomers: async (
    filters: CustomerFilters = {}
  ): Promise<PaginatedCustomers> => {
    const API_BASE_URL = getApiBaseUrl();
    const { page = 1, page_size = 10, search } = filters;

    const url = new URL(`${API_BASE_URL}/api/customer/register/`);
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
      throw new Error(
        `Failed to fetch registered customers: ${response.status}`
      );
    }

    return await response.json();
  },
};
