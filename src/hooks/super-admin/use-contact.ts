import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { superAdminContactApi } from "@/services/api/super-admin/contact";

export const useSuperAdminContactMessages = (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  return useQuery({
    queryKey: ["super-admin-contact-messages", page, pageSize, search],
    queryFn: () => superAdminContactApi.getMessages(page, pageSize, search),
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
