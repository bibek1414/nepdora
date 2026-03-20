"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { handleApiError } from "@/utils/api-error";
import { getServerUser } from "@/hooks/use-jwt-server";
import type { FacebookIntegration } from "@/types/owner-site/admin/facebook";
import { getServerApiBaseUrl } from "@/config/server-site";
import { getTenantDomain } from "@/config/site";
// Create headers with tenant subdomain
async function createServerHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const user = await getServerUser();
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
  const tenantDomain = user?.sub_domain ? `${user.sub_domain}.${baseDomain}` : "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Tenant-Domain": tenantDomain,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

// GET: Fetch all integrations (server-side only)
export async function getFacebookIntegrations(): Promise<
  FacebookIntegration[]
> {
  try {
    const API_BASE_URL = await getServerApiBaseUrl();
    const url = `${API_BASE_URL}/api/facebook/`;
    const headers = await createServerHeaders();
    console.log("headers", headers);
    console.log("url", url);
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Ensure fresh data
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      console.error("Failed to fetch Facebook integrations:", response.status);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch Facebook integrations:", error);
    return [];
  }
}

// DELETE: Remove integration
export async function deleteFacebookIntegration(id: number) {
  try {
    const API_BASE_URL = await getServerApiBaseUrl();
    const headers = await createServerHeaders();

    const response = await fetch(`${API_BASE_URL}/api/facebook/${id}/`, {
      method: "DELETE",
      headers,
    });

    await handleApiError(response);

    // Revalidate the page to show updated data
    revalidatePath("/admin/facebook");

    return {
      success: true,
      message: "Facebook integration deleted successfully",
    };
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete Facebook integration",
    };
  }
}

// PATCH: Toggle integration status
export async function toggleFacebookIntegration(
  id: number,
  is_enabled: boolean
) {
  try {
    const API_BASE_URL = await getServerApiBaseUrl();
    const headers = await createServerHeaders();

    const response = await fetch(`${API_BASE_URL}/api/facebook/${id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ is_enabled }),
    });

    await handleApiError(response);

    revalidatePath("/admin/facebook");

    return {
      success: true,
      message: is_enabled
        ? "Facebook page enabled successfully"
        : "Facebook page disabled successfully",
    };
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to toggle Facebook integration",
    };
  }
}
