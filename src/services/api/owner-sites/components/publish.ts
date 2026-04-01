import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";

const API_BASE_URL = getApiBaseUrl();

const publishSiteApi = async () => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/publish-all/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({}), // empty payload
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || "Failed to publish site");
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export default publishSiteApi;
