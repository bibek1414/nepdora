export interface Logistics {
  id: string;
  logistic: "Dash" | "YDM";
  email: string;
  password: string;
  client_id: number;
  client_secret: string;
  grant_type: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLogisticsRequest {
  logistic: "Dash" | "YDM";
  email: string;
  password: string;
  client_id: number;
  client_secret: string;
  grant_type: string;
  is_enabled: boolean;
}

export interface UpdateLogisticsRequest {
  logistic?: "Dash" | "YDM";
  email?: string;
  password?: string;
  client_id?: number;
  client_secret?: string;
  grant_type?: string;
  is_enabled?: boolean;
}

export interface CreateLogisticsResponse {
  success: boolean;
  data: Logistics;
  message: string;
}

export interface UpdateLogisticsResponse {
  success: boolean;
  data: Logistics;
  message: string;
}

export interface GetLogisticsResponse {
  success: boolean;
  data: Logistics;
  message: string;
}

export interface DeleteLogisticsResponse {
  success: boolean;
  message: string;
}
