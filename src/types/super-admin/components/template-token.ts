export interface TemplateTokenRequest {
  client_id: number | string;
}

export interface TemplateOwner {
  id: number;
  email: string;
  role: string;
}

export interface TemplateClient {
  id: number;
  name: string;
  schema_name: string;
  is_template_account: boolean;
  domain: string;
}

export interface TemplateTokenResponse {
  access_token: string;
  refresh_token: string;
  owner: TemplateOwner;
  client: TemplateClient;
}

export interface StoredUserData {
  id: number;
  email: string;
  role: string;
  sub_domain: string;
}
