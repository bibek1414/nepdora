import { cookies } from "next/headers";
import { getServerUser } from "@/hooks/use-jwt-server";

export const serverSiteConfig = {
  name: "Nepdora",
  description: "Nepdora Preview System",
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://sales-crm-8s09.onrender.com",
  baseDomain:
    process.env.NEXT_PUBLIC_BASE_DOMAIN ||
    "unknown-kidney-technical-soft.trycloudflare.com",
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
 * Returns the static base backend URL
 */
export const getServerApiBaseUrl = async (): Promise<string> => {
  return serverSiteConfig.apiBaseUrl;
};

/**
 * Get subdomain from JWT
 */
export const getServerSubdomain = async (): Promise<string | null> => {
  try {
    const user = await getServerUser();
    return user?.sub_domain || null;
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

  // Add tenant domain for multi-tenant backend
  if (user?.sub_domain) {
    headers["X-Tenant-Domain"] = `${user.sub_domain}.nepdora.com`;
  }

  return headers;
};

/**
 * Check if running on server
 */
export const isServer = () => typeof window === "undefined";
