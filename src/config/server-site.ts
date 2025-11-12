import { cookies } from "next/headers";
import { getServerUser } from "@/hooks/use-jwt-server";

export const serverSiteConfig = {
  name: "Nepdora",
  description: "Nepdora Preview System",
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://nepdora.baliyoventures.com",
  baseDomain:
    process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.baliyoventures.com",
  protocol: process.env.NEXT_PUBLIC_PROTOCOL || "https",
  isDev: process.env.NODE_ENV !== "production",
  frontendDevPort: Number(process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000),
};

/**
 * Build API URL for a subdomain
 */
export const buildServerPreviewApi = (subdomain: string) =>
  `${serverSiteConfig.protocol}://${subdomain}.${serverSiteConfig.baseDomain}`;

/**
 * Get API base URL for server components
 * Uses JWT to determine user's subdomain
 */
export const getServerApiBaseUrl = async (): Promise<string> => {
  try {
    const user = await getServerUser();

    // If user has a domain, use it directly
    if (user?.domain) {
      return `${serverSiteConfig.protocol}://${user.domain}`;
    }

    // If user has a subdomain, build the URL
    if (user?.subDomain) {
      return buildServerPreviewApi(user.subDomain);
    }

    // Fallback to base URL
    return serverSiteConfig.apiBaseUrl;
  } catch (error) {
    console.error("Error getting server API URL:", error);
    return serverSiteConfig.apiBaseUrl;
  }
};

/**
 * Get subdomain from JWT
 */
export const getServerSubdomain = async (): Promise<string | null> => {
  try {
    const user = await getServerUser();
    return user?.subDomain || null;
  } catch (error) {
    console.error("Error getting server subdomain:", error);
    return null;
  }
};

/**
 * Create server headers with authentication and tenant info
 */
export const createServerHeaders = async (): Promise<HeadersInit> => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const user = await getServerUser();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  // Add tenant subdomain for multi-tenant backend
  if (user?.subDomain) {
    headers["X-Tenant"] = user.subDomain;
  }

  return headers;
};

/**
 * Check if running on server
 */
export const isServer = () => typeof window === "undefined";
