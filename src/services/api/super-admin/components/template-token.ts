import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export interface TemplateTokenRequest {
  client_id: number | string;
}

export interface TemplateTokenResponse {
  access_token: string;
  refresh_token: string;
  owner: {
    id: number;
    email: string;
    role: string;
  };
  client: {
    id: number;
    name: string;
    schema_name: string;
    is_template_account: boolean;
    domain: string;
  };
}

export const templateTokenApi = {
  /**
   * Verify template and get access tokens
   */
  verifyTemplate: async (
    clientId: number | string
  ): Promise<TemplateTokenResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/template-tokens/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ client_id: clientId }),
    });

    await handleApiError(response);
    return await response.json();
  },
};
