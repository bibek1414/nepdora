import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  CreateFacebookIntegrationRequest,
  CreateFacebookIntegrationResponse,
  UpdateFacebookIntegrationRequest,
  UpdateFacebookIntegrationResponse,
  DeleteFacebookIntegrationResponse,
  FacebookIntegration,
} from "@/types/owner-site/admin/facebook";

// src/services/api/owner-sites/admin/facebook.ts
export const useFacebookApi = {
  // Add optional tenant param here
  getFacebookIntegrations: async (params?: { tenant?: string }) => {
    const query = params?.tenant ? `?tenant=${params.tenant}` : "";
    const res = await fetch(`/api/facebook/${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFacebookIntegration: async (id: string, data: any) => {
    const res = await fetch(`/api/facebook/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
