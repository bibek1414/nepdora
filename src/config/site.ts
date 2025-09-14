export const siteConfig = {
  name: " ",
  description: "Nepdora",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com",
  protocol:
    process.env.NEXT_PUBLIC_PROTOCOL ||
    (process.env.NODE_ENV === "production" ? "https" : "http"),
  isDev: process.env.NODE_ENV !== "production",
  frontendDevPort: Number(process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000),
};

const buildPreviewApi = (subdomain: string) =>
  `https://${subdomain}.nepdora.baliyoventures.com`;

const extractJwtDomain = (): string | null => {
  try {
    const raw = localStorage.getItem("authTokens");
    if (!raw) return null;

    const tokens = JSON.parse(raw);
    const accessToken = tokens?.access_token;
    if (!accessToken) return null;

    const parts = accessToken.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
    if (decoded?.domain) {
      return `https://${decoded.domain}`;
    }
  } catch (e) {
    console.error("Error decoding JWT for API base URL:", e);
  }
  return null;
};

const extractLocalPreviewSubdomain = (url: URL): string | null => {
  // 1) subdomain.localhost
  // e.g., bibek.localhost:3000
  if (url.hostname.endsWith(".localhost")) {
    const subdomain = url.hostname.split(".")[0];
    if (subdomain && subdomain !== "localhost") return subdomain;
  }

  // 2) /preview/<subdomain> or /preview/<id>
  // Prefer a nice string slug; fallback to numeric ID if that's what you use
  const pathMatch = url.pathname.match(/\/preview\/([^/?#]+)/);
  if (pathMatch?.[1]) return pathMatch[1];

  // 3) ?previewSubdomain=<subdomain>
  const qp = url.searchParams.get("previewSubdomain");
  if (qp) return qp;

  // 4) Env override (useful in dev)
  if (process.env.NEXT_PUBLIC_PREVIEW_SUBDOMAIN) {
    return process.env.NEXT_PUBLIC_PREVIEW_SUBDOMAIN;
  }

  return null;
};

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const currentUrl = new URL(window.location.href);
    const hostname = currentUrl.hostname;
    const isPreview =
      currentUrl.pathname.includes("/preview/") ||
      currentUrl.searchParams.has("previewSubdomain") ||
      hostname.endsWith(".nepdora.baliyoventures.com") ||
      hostname.endsWith(".nepdora.com") ||
      hostname.endsWith(".localhost");

    // 1) Preview handling (hosted + localhost)
    if (isPreview) {
      // Hosted preview domains
      if (hostname.includes(".nepdora.baliyoventures.com")) {
        const subdomain = hostname.split(".")[0];
        if (subdomain) return buildPreviewApi(subdomain);
      }
      if (hostname.includes(".nepdora.com")) {
        const subdomain = hostname.split(".")[0];
        if (subdomain) return buildPreviewApi(subdomain);
      }

      // Localhost variations
      if (hostname === "localhost" || hostname.endsWith(".localhost")) {
        const subdomain = extractLocalPreviewSubdomain(currentUrl);
        if (subdomain) return buildPreviewApi(subdomain);
      }
    }

    // 2) JWT-derived domain (original logic)
    const jwtDomain = extractJwtDomain();
    if (jwtDomain) return jwtDomain;
  }

  // 3) Fallback
  return siteConfig.apiBaseUrl;
};
