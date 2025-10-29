export interface PromoCode {
  id: number;
  code: string;
  discount_percentage: string;
  valid_from: string;
  valid_to: string;
}

export interface ValidatePromoCodeRequest {
  code: string;
}

export interface ValidatePromoCodeResponse {
  valid: boolean;
  message: string;
  promo_code?: PromoCode;
}

export interface PromoCodeError {
  code?: string[];
}
