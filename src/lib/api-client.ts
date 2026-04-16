import { getTenantDomain } from "@/config/site";

/**
 * Custom fetch wrapper that automatically injects the tenant domain header
 * for API calls.
 */
export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit & { skipTenantDomain?: boolean }
): Promise<Response> => {
  const customHeaders = new Headers(init?.headers);

  if (!init?.skipTenantDomain) {
    const tenantDomain = await getTenantDomain({
      skipHeaders: !!init?.skipTenantDomain,
    });
    if (tenantDomain) {
      customHeaders.set("X-Tenant-Domain", tenantDomain);
    }
  }

  // Clean up the custom property before passing to standard fetch
  const { skipTenantDomain, ...fetchInit } = init || {};

  return fetch(input, {
    ...fetchInit,
    headers: customHeaders,
  });
};
