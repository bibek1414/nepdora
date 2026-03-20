export const siteConfig = {
  name: "Nepdora",
  description: "Nepdora Preview System",
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://nepdora.baliyoventures.com",
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com",
  protocol: process.env.NEXT_PUBLIC_PROTOCOL || "https",
  isDev: process.env.NODE_ENV !== "production",
  frontendDevPort: Number(process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000),
};

/**
 * Root domain
 */
export const rootDomain = siteConfig.isDev
  ? `localhost:${siteConfig.frontendDevPort}`
  : siteConfig.baseDomain;

/**
 * Build API URL for a subdomain
 */
export const buildPreviewApi = (subdomain: string) =>
  `https://${subdomain}.unknown-kidney-technical-soft.trycloudflare.com`;

/**
 * Extract subdomain from URL or query params
 */
export const extractSubdomain = (url: URL): string | null => {
  const hostname = url.hostname; // e.g., bibek.nepdora.com
  const baseDomain = siteConfig.baseDomain; // nepdora.com

  // 1. Prod subdomain
  if (hostname.endsWith(`.${baseDomain}`)) {
    const sub = hostname.replace(`.${baseDomain}`, "");
    if (sub && sub !== "www") return sub;
  }

  // 2. Dev localhost subdomain
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.split(".")[0];
    if (sub && sub !== "localhost") return sub;
  }

  // 3. /preview/<subdomain>
  const match = url.pathname.match(/\/preview\/([^/?#]+)/);
  if (match?.[1]) return match[1];

  // 4. Query param
  const qp = url.searchParams.get("previewSubdomain");
  if (qp) return qp;

  // 5. Env override
  return process.env.NEXT_PUBLIC_PREVIEW_SUBDOMAIN || null;
};

/**
 * Extract tenant domain from URL or query params
 */
export const getTenantDomain = (): string | null => {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const hostname = url.hostname; // ⚠️ this already excludes port
  const subdomain = extractSubdomain(url);

  if (!subdomain) return null;

  // ✅ Development
  if (siteConfig.isDev) {
    return `${subdomain}.localhost`;
  }

  // ✅ Production
  return `${subdomain}.${siteConfig.baseDomain}`;
};

/**
 * Get API base URL
 */
export const getApiBaseUrl = (): string => {
  return siteConfig.apiBaseUrl;
};
