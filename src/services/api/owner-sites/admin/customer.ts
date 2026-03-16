import {
  CreateCustomerRequest,
  Customer,
  CustomerFilters,
  PaginatedCustomers,
} from "@/types/owner-site/admin/customer";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

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
      headers: createHeaders(),
    });

    await handleApiError(response);

    return await response.json();
  },

  registerCustomer: async (data: CreateCustomerRequest): Promise<Customer> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/customer/register/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return await response.json();
  },
};
