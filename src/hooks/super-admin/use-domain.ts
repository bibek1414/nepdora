// use-domain.ts
import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "@/config/site";
import { Domain } from "@/types/super-admin/domain";
import { PaginatedResponse } from "@/types/super-admin/domain";

const API_BASE_URL = siteConfig.apiBaseUrl;

export async function getDomains(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Domain>> {
  const res = await fetch(
    `${API_BASE_URL}/api/domains/?page=${page}&page_size=${pageSize}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch domains");
  return res.json();
}

export function useDomains(page: number, pageSize: number) {
  return useQuery<PaginatedResponse<Domain>, Error>({
    queryKey: ["domains", page, pageSize],
    queryFn: () => getDomains(page, pageSize),
  });
}
