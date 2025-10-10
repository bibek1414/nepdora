export const siteConfig = {
  name: "Nepdora",
  description: "Nepdora Preview System",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  baseDomain:
    process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.baliyoventures.com",
  protocol:
    process.env.NEXT_PUBLIC_PROTOCOL ||
    (process.env.NODE_ENV === "production" ? "https" : "http"),
  isDev: process.env.NODE_ENV !== "production",
  frontendDevPort: Number(process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000),
};

export const rootDomain = siteConfig.isDev
  ? `localhost:${siteConfig.baseDomain}`
  : siteConfig.baseDomain;

/**
 * Build preview API URL for a subdomain
 */
export const buildPreviewApi = (subdomain: string) =>
  `https://${subdomain}.${siteConfig.baseDomain}`;

/**
 * Extract subdomain from local preview URL
 */
export const extractLocalPreviewSubdomain = (url: URL): string | null => {
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
  if (process.env.NEXT_PUBLIC_PREVIEW_SUBDOMAIN) {
    return process.env.NEXT_PUBLIC_PREVIEW_SUBDOMAIN;
  }

  return null;
};

/**
 * Extract domain from JWT stored in localStorage (client only)
 */
export const extractJwtDomain = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("authTokens");
    if (!raw) return null;

    const tokens = JSON.parse(raw);
    const accessToken = tokens?.access_token;
    if (!accessToken) return null;

    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const decoded = JSON.parse(
      decodeURIComponent(
        escape(
          atob(payload.replace(/-/g, "+").replace(/_/g, "/")).padEnd(
            Math.ceil(payload.length / 4) * 4,
            "="
          )
        )
      )
    );

    if (decoded?.domain) return `https://${decoded.domain}`;
  } catch (err) {
    console.error("❌ Error decoding JWT for API domain:", err);
  }

  return null;
};

/**
 * Get API base URL (works for preview subdomain or normal site)
 */
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const hostname = url.hostname;

    // 1) Preview handling
    const isPreview =
      url.pathname.includes("/preview/") ||
      url.searchParams.has("previewSubdomain") ||
      hostname.endsWith(".nepdora.baliyoventures.com") ||
      hostname.endsWith(".nepdora.com") ||
      hostname.endsWith(".localhost");

    if (isPreview) {
      const subdomain = extractLocalPreviewSubdomain(url);
      if (subdomain) return buildPreviewApi(subdomain);
    }

    // 2) JWT-derived domain (fallback)
    const jwtDomain = extractJwtDomain();
    if (jwtDomain) return jwtDomain;
  }

  // 3) Default API
  return siteConfig.apiBaseUrl;
};
