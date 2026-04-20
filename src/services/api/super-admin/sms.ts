import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import {
  TenantSMSSettingsResponse,
  AddSMSCreditPayload,
} from "@/types/super-admin/sms";

export const getTenantsSMSSettings = async (
  page = 1,
  search = ""
): Promise<TenantSMSSettingsResponse> => {
  const API_BASE_URL = getApiBaseUrl();
  let url = `${API_BASE_URL}/api/sms/admin/tenants-settings/?page=${page}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const response = await apiFetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch SMS settings");
  return response.json();
};

export const addSMSCredit = async (payload: AddSMSCreditPayload) => {
  const API_BASE_URL = getApiBaseUrl();
  const response = await apiFetch(`${API_BASE_URL}/api/sms/admin/purchases/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add SMS credits");
  }

  return response.json();
};
