export interface SMSSetting {
  id: number;
  sms_credit: number;
  sms_enabled: boolean;
  delivery_sms_enabled: boolean;
  delivery_sms_template: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateSMSSettingRequest {
  sms_enabled?: boolean;
  delivery_sms_enabled?: boolean;
  delivery_sms_template?: string;
}

export interface UpdateSMSSettingResponse extends SMSSetting {
  message?: string;
}
