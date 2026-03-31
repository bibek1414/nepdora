// use-domain.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDomains,
  createDomain,
  updateDomain,
  deleteDomain,
  CreateDomainPayload,
  UpdateDomainPayload,
} from "@/services/api/super-admin/domain";
import { PaginatedResponse } from "@/types/super-admin/domain";
import { Domain } from "@/types/super-admin/domain";

// ── Query ─────────────────────────────────────────────────────────────────────

export function useDomains(page: number, pageSize: number, search?: string) {
  return useQuery<PaginatedResponse<Domain>, Error>({
    queryKey: ["domains", page, pageSize, search],
    queryFn: () => getDomains(page, pageSize, undefined, search),
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDomainPayload) => createDomain(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}

export function useUpdateDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateDomainPayload;
    }) => updateDomain(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}

export function useDeleteDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDomain(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains"] }),
  });
}
