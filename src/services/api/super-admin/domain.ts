import { apiFetch } from "@/lib/api-client";
import { siteConfig } from "@/config/site";
import { Domain, PaginatedResponse } from "@/types/super-admin/domain";

const API_BASE_URL = siteConfig.apiBaseUrl;

// ── GET (list) ────────────────────────────────────────────────────────────────

export async function getDomains(
  page = 1,
  pageSize = 10,
  paymentEnabled?: boolean
): Promise<PaginatedResponse<Domain>> {
  let url = `${API_BASE_URL}/api/domains/?page=${page}&page_size=${pageSize}`;
  if (paymentEnabled) url += "&payment=enabled";

  const res = await apiFetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch domains: ${res.statusText}`);
  return res.json();
}

// ── GET (single) ──────────────────────────────────────────────────────────────

export async function getDomainById(id: number): Promise<Domain> {
  const res = await apiFetch(`${API_BASE_URL}/api/domains/${id}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch domain: ${res.statusText}`);
  return res.json();
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export interface CreateDomainPayload {
  domain: string;
  is_primary: boolean;
  tenant: number; // tenant id
}

export async function createDomain(
  payload: CreateDomainPayload
): Promise<Domain> {
  const res = await apiFetch(`${API_BASE_URL}/api/domains/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.detail || `Failed to create domain: ${res.statusText}`
    );
  }
  return res.json();
}

// ── UPDATE (partial) ──────────────────────────────────────────────────────────

export interface UpdateDomainPayload {
  domain?: string;
  is_primary?: boolean;
}

export async function updateDomain(
  id: number,
  payload: UpdateDomainPayload
): Promise<Domain> {
  const res = await apiFetch(`${API_BASE_URL}/api/domains/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.detail || `Failed to update domain: ${res.statusText}`
    );
  }
  return res.json();
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteDomain(id: number): Promise<void> {
  const res = await apiFetch(`${API_BASE_URL}/api/domains/${id}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.detail || `Failed to delete domain: ${res.statusText}`
    );
  }
}
