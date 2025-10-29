import { useMutation } from "@tanstack/react-query";
import { promoCodeApi } from "@/services/api/owner-sites/admin/promo-code-validate";
import { ValidatePromoCodeRequest } from "@/types/owner-site/admin/promo-code-validate";

// Validate promo code
export const useValidatePromoCode = () => {
  return useMutation({
    mutationFn: (data: ValidatePromoCodeRequest) =>
      promoCodeApi.validatePromoCode(data),
  });
};
