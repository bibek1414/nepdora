const rawSiteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  `https://${process.env.NEXT_PUBLIC_BASE_DOMAIN || "www.nepdora.com"}`;

export const SITE_URL = rawSiteUrl.replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_URL}/nepdora-logooo.svg`;
export const SITE_NAME = "Nepdora";

export function absoluteUrl(path = "") {
  const normalizedPath =
    path.startsWith("/") || path === "" ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
