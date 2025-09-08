import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamAPI } from "@/services/api/owner-sites/team-member";
import { Members } from "@/types/owner-site/team-member";

export const useTeamMembers = () => {
  return useQuery<Members, Error>({
    queryKey: ["team-members"],
    queryFn: () => teamAPI.getTeamMembers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberData: FormData) => teamAPI.createTeamMember(memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, memberData }: { id: number; memberData: FormData }) =>
      teamAPI.updateTeamMember(id, memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teamAPI.deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};
