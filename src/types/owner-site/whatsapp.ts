export interface WhatsApp {
  id: string;
  message: string;
  phone_number: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWhatsAppRequest {
  message: string;
  phone_number: string;
  is_enabled: boolean;
}

export interface UpdateWhatsAppRequest {
  message?: string;
  phone_number?: string;
  is_enabled?: boolean;
}

export interface CreateWhatsAppResponse {
  success: boolean;
  data: WhatsApp;
  message: string;
}

export interface UpdateWhatsAppResponse {
  success: boolean;
  data: WhatsApp;
  message: string;
}

export interface GetWhatsAppResponse {
  success: boolean;
  data: WhatsApp;
  message: string;
}

export interface DeleteWhatsAppResponse {
  success: boolean;
  message: string;
}
