// services/api/owner-sites/admin/promo-code.ts

import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  ValidatePromoCodeRequest,
  ValidatePromoCodeResponse,
  PromoCodeError,
} from "@/types/owner-site/admin/promo-code-validate";

export const promoCodeApi = {
  // Validate promo code
  validatePromoCode: async (
    data: ValidatePromoCodeRequest
  ): Promise<ValidatePromoCodeResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/promocode/validate/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    // If the response is not ok, check if it's a validation error
    if (!response.ok) {
      const errorData: PromoCodeError = await response.json();
      if (errorData.code) {
        throw new Error(errorData.code[0]);
      }
      await handleApiError(response);
    }

    return response.json();
  },
};
