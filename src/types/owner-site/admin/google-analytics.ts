export interface GoogleAnalytics {
  id: string;
  measurement_id: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGoogleAnalyticsRequest {
  measurement_id: string;
  is_enabled: boolean;
}

export interface UpdateGoogleAnalyticsRequest {
  measurement_id?: string;
  is_enabled?: boolean;
}

export interface CreateGoogleAnalyticsResponse {
  success: boolean;
  data: GoogleAnalytics;
  message: string;
}

export interface UpdateGoogleAnalyticsResponse {
  success: boolean;
  data: GoogleAnalytics;
  message: string;
}

export interface GetGoogleAnalyticsResponse {
  success: boolean;
  data: GoogleAnalytics;
  message: string;
}

export interface DeleteGoogleAnalyticsResponse {
  success: boolean;
  message: string;
}
