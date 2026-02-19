import { getApiBaseUrl } from "@/config/site";
import { createHeadersCustomer } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import { ProfileFormValues } from "@/schemas/customer/profile.form";
import { CustomerProfile, ProfileResponse } from "@/types/customer/profile";

export const profileApi = {
  getProfile: async (): Promise<CustomerProfile> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/customer/detail/`, {
      method: "GET",
      headers: createHeadersCustomer(),
    });

    await handleApiError(response);
    const result = await response.json();
    return result;
  },

  updateProfile: async (
    data: Partial<ProfileFormValues>
  ): Promise<ProfileResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/customer/detail/`, {
      method: "PATCH",
      headers: createHeadersCustomer(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return response.json();
  },
};
