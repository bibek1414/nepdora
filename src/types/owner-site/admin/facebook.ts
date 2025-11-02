export interface FacebookIntegration {
  id?: number;
  user_token: string;
  app_id: string;
  app_secret: string;
  page_id: string;
  page_access_token: string;
  page_name: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFacebookIntegrationRequest {
  user_token: string;
  app_id: string;
  app_secret: string;
  page_id: string;
  page_access_token: string;
  page_name: string;
  is_enabled?: boolean;
}

export interface CreateFacebookIntegrationResponse {
  data: FacebookIntegration;
  message: string;
}

export interface UpdateFacebookIntegrationRequest {
  user_token?: string;
  app_id?: string;
  app_secret?: string;
  page_id?: string;
  page_access_token?: string;
  page_name?: string;
  is_enabled?: boolean;
}

export interface UpdateFacebookIntegrationResponse {
  data: FacebookIntegration;
  message: string;
}

export interface DeleteFacebookIntegrationResponse {
  message: string;
}
