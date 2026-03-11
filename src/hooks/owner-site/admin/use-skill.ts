"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { skillApi } from "@/services/api/owner-sites/admin/skill";
import { Skill, CreateSkill } from "@/types/owner-site/admin/skill";

export const skillKeys = {
  all: ["skills"] as const,
  lists: () => [...skillKeys.all, "list"] as const,
};

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: skillKeys.lists(),
    queryFn: skillApi.getSkills,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillData: CreateSkill) => skillApi.createSkill(skillData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, skillData }: { id: number; skillData: CreateSkill }) =>
      skillApi.updateSkill(id, skillData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => skillApi.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
    },
  });
}
