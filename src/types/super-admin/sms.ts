export interface TenantSMSSettings {
  tenant: {
    id: number;
    owner: {
      id: number;
      first_name: string;
      last_name: string;
      website_type: string;
      email: string;
      role: string;
      phone_number: string;
    };
    pricing_plan: {
      id: number;
      name: string;
      price: string;
      unit: string;
    } | null;
    schema_name: string;
    name: string;
    created_on: string;
    paid_until: string | null;
    template_image: string | null;
    is_template_account: boolean;
    repo_url: string | null;
    description: string | null;
    preview_url: string | null;
    template_category: string | null;
    template_subcategory: string | null;
  };
  sms_enabled: boolean;
  sms_credit: number;
  delivery_sms_enabled: boolean;
}

export interface TenantSMSSettingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TenantSMSSettings[];
}

export interface AddSMSCreditPayload {
  client: number; // tenant_id
  amount: number;
}
