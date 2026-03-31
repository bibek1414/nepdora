import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteConfig } from "@/config/site";
import { User, PaginatedResponse } from "@/types/super-admin/user";

const API_BASE_URL = siteConfig.apiBaseUrl;

// GET users
export async function getUsers(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<PaginatedResponse<User>> {
  let url = `${API_BASE_URL}/api/user-lists/?page=${page}&page_size=${pageSize}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// DELETE user
export async function deleteUser(userId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/user-lists/${userId}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to delete user");
}

// React Query hooks
export function useUsers(page: number, pageSize: number, search?: string) {
  return useQuery<PaginatedResponse<User>, Error>({
    queryKey: ["users", page, pageSize, search],
    queryFn: () => getUsers(page, pageSize, search),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
