import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { superAdminContactApi } from "@/services/api/super-admin/contact";

export const useSuperAdminContactMessages = () => {
  return useQuery({
    queryKey: ["super-admin-contact-messages"],
    queryFn: () => superAdminContactApi.getMessages(),
  });
};

export const useSuperAdminDeleteContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superAdminContactApi.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["super-admin-contact-messages"],
      });
    },
  });
};
