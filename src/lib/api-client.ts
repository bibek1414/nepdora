import { getTenantDomain } from "@/config/site";

/**
 * Custom fetch wrapper that automatically injects the tenant domain header 
 * for API calls.
 */
export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const customHeaders = new Headers(init?.headers);
  const tenantDomain = getTenantDomain();

  if (tenantDomain) {
    customHeaders.set("X-Tenant-Domain", tenantDomain);
  }

  return fetch(input, {
    ...init,
    headers: customHeaders,
  });
};
