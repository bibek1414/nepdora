import { getApiBaseUrl } from "@/config/site";
import {
  NepdoraPopupFormData,
  NepdoraPopupSubmission,
} from "@/types/marketing/nepdora-popup";

export const marketingNepdoraPopupApi = {
  submit: async (
    data: NepdoraPopupFormData
  ): Promise<NepdoraPopupSubmission> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-popup-form/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to submit popup form");
    }

    return response.json();
  },
};
