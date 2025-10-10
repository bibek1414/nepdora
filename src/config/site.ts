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
 * Build preview API URL for a subdomain
 */
export const buildPreviewApi = (subdomain: string) =>
  `https://${subdomain}.nepdora.baliyoventures.com`;

/**
 * Extract subdomain from URL or query params
 */
export const extractSubdomain = (url: URL): string | null => {
  // subdomain.localhost
  if (url.hostname.endsWith(".localhost")) {
    const sub = url.hostname.split(".")[0];
    if (sub && sub !== "localhost") return sub;
  }

  // /preview/<subdomain>
  const match = url.pathname.match(/\/preview\/([^/?#]+)/);
  if (match?.[1]) return match[1];

  // ?previewSubdomain=<subdomain>
  const qp = url.searchParams.get("previewSubdomain");
  if (qp) return qp;

  // Env override
  return process.env.NEXT_PUBLIC_PREVIEW_SUBDOMAIN || null;
};

/**
 * Extract domain from JWT stored in localStorage (client-only)
 */
export const extractJwtDomain = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("authTokens");
    if (!raw) return null;

    const { access_token } = JSON.parse(raw) || {};
    if (!access_token) return null;

    const payload = JSON.parse(
      decodeURIComponent(
        escape(
          atob(
            access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
          ).padEnd(Math.ceil(access_token.split(".")[1].length / 4) * 4, "=")
        )
      )
    );

    return payload?.domain ? `https://${payload.domain}` : null;
  } catch (err) {
    console.error("❌ Error decoding JWT for API domain:", err);
    return null;
  }
};

/**
 * Get API base URL (uses preview subdomain if available)
 */
export const getApiBaseUrl = (): string => {
  if (typeof window === "undefined") return siteConfig.apiBaseUrl;

  const subdomain = extractSubdomain(new URL(window.location.href));
  return subdomain ? buildPreviewApi(subdomain) : siteConfig.apiBaseUrl;
};
