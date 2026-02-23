import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateFooterRequest,
  UpdateFooterRequest,
} from "@/types/owner-site/components/footer";
import { toast } from "sonner";
import { useWebsiteSocketContext } from "@/providers/website-socket-provider";

const FOOTER_QUERY_KEY = ["footer"];

export const useFooterQuery = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  return useQuery({
    queryKey: FOOTER_QUERY_KEY,
    queryFn: () => {
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = subscribe("footer", message => {
          unsubscribe();
          resolve({
            data: message.data || null,
            message: message.data ? "Footer retrieved" : "No footer found",
          });
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for footer"));
        }, 10000);

        sendMessage({
          action: "get_footer",
          status: "preview",
        });
      });
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useFooterQueryPublished = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  return useQuery({
    queryKey: [...FOOTER_QUERY_KEY, "published"],
    queryFn: () => {
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = subscribe("footer", message => {
          unsubscribe();
          resolve({
            data: message.data || null,
            message: message.data ? "Footer retrieved" : "No footer found",
          });
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for published footer"));
        }, 10000);

        sendMessage({
          action: "get_footer",
          status: "published",
        });
      });
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateFooterMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFooterRequest) => {
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = subscribe("footer_created", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "create_footer",
          ...data,
        });
      });
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: FOOTER_QUERY_KEY });
      const previousFooter = queryClient.getQueryData(FOOTER_QUERY_KEY);

      queryClient.setQueryData(FOOTER_QUERY_KEY, {
        data: {
          ...variables,
          status: "draft",
          component_type: "footer",
          isOptimistic: true,
        },
        message: "Footer created/updated (optimistic)",
      });

      return { previousFooter };
    },
    onSuccess: data => {
      toast.success("Footer created successfully");
    },
    onError: (error: any, __, context) => {
      if (context?.previousFooter) {
        queryClient.setQueryData(FOOTER_QUERY_KEY, context.previousFooter);
      }
      const errorMessage =
        error?.data?.detail ||
        error?.detail ||
        error?.message ||
        "Failed to create footer";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateFooterMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFooterRequest) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("footer_updated", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "update_footer",
          ...data,
        });
      });
    },
    onMutate: async (data: UpdateFooterRequest) => {
      await queryClient.cancelQueries({ queryKey: FOOTER_QUERY_KEY });
      const previousFooter = queryClient.getQueryData(FOOTER_QUERY_KEY);

      queryClient.setQueryData(FOOTER_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, ...data },
        };
      });

      return { previousFooter };
    },
    onSuccess: data => {
      toast.success("Footer updated successfully");
    },
    onError: (error: any, __, context) => {
      if (context?.previousFooter) {
        queryClient.setQueryData(FOOTER_QUERY_KEY, context.previousFooter);
      }
      toast.error(error.message || "Failed to update footer");
    },
  });
};

export const useDeleteFooterMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("footer_deleted", message => {
          const deletedId = message.id || message.data?.id;
          if (deletedId === id) {
            unsubscribe();
            resolve(message.data);
          }
        });
        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "delete_footer",
          id: id,
        });
      });
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: FOOTER_QUERY_KEY });
      queryClient.setQueryData(FOOTER_QUERY_KEY, null);
      toast.success("Footer deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete footer");
    },
  });
};

export const useReplaceFooterMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFooterRequest) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("footer_replaced", message => {
          unsubscribe();
          resolve(message.data);
        });
        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "replace_footer",
          ...data,
        });
      });
    },
    onMutate: async (data: CreateFooterRequest) => {
      await queryClient.cancelQueries({ queryKey: FOOTER_QUERY_KEY });
      const previousFooter = queryClient.getQueryData(FOOTER_QUERY_KEY);

      queryClient.setQueryData(FOOTER_QUERY_KEY, {
        data: {
          ...data,
          status: "draft",
          component_type: "footer",
          isOptimistic: true,
        },
        message: "Footer replaced (optimistic)",
      });

      return { previousFooter };
    },
    onSuccess: data => {
      toast.success("Footer replaced successfully");
    },
    onError: (error: any, __, context) => {
      if (context?.previousFooter) {
        queryClient.setQueryData(FOOTER_QUERY_KEY, context.previousFooter);
      }
      toast.error(error.message || "Failed to replace footer");
    },
  });
};
