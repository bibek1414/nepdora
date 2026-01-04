import { siteConfig } from "@/config/site";
import { ContactFormData } from "@/types/marketing/contact";

const API_BASE_URL = siteConfig.apiBaseUrl;

export const marketingContactApi = {
  submit: async (
    data: ContactFormData
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/api/support/nepdora-contact/`,
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
      throw new Error(errorData.message || "Failed to submit contact form");
    }

    return response.json();
  },
};
