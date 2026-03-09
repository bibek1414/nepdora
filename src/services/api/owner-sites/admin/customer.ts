import { Customer } from "@/types/owner-site/admin/customer";
import { getApiBaseUrl } from "@/config/site";

export const customerAPI = {
  getRegisteredCustomers: async (): Promise<Customer[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/customer/register/`, {
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
