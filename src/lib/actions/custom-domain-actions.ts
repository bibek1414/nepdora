"use server";

import {
  serverGet,
  serverPost,
  serverPatch,
  serverDelete,
} from "@/lib/server-api-client";

export interface CustomDomain {
  id: number;
  domain: string;
  is_primary: boolean;
  tenant: {
    id: number;
    schema_name: string;
    name: string;
  };
}

export async function getCustomDomains() {
  try {
    const domains = await serverGet<CustomDomain[]>("/api/custom-domain/", {
      cache: "no-store",
    });
    return { success: true, domains };
  } catch (error: any) {
    console.error("Failed to fetch custom domains:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch domains.",
    };
  }
}

export async function saveCustomDomain(domainName: string) {
  try {
    const result = await serverPost<CustomDomain>("/api/custom-domain/", {
      domain: domainName,
    });
    return { success: true, domain: result };
  } catch (error: any) {
    console.error("Failed to save custom domain:", error);
    return { success: false, error: error.message || "Failed to save domain." };
  }
}

export async function updateCustomDomain(id: number, domainName: string) {
  try {
    const result = await serverPatch<CustomDomain>(`/api/domains/${id}/`, {
      domain: domainName,
    });
    return { success: true, domain: result };
  } catch (error: any) {
    console.error("Failed to update custom domain:", error);
    return {
      success: false,
      error: error.message || "Failed to update domain.",
    };
  }
}

export async function deleteCustomDomain(id: number) {
  try {
    await serverDelete(`/api/domains/${id}/`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete custom domain:", error);
    return {
      success: false,
      error: error.message || "Failed to delete domain.",
    };
  }
}
