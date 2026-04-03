import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavbarApi } from "@/services/api/owner-sites/components/navbar";
import {
  CreateNavbarRequest,
  UpdateNavbarRequest,
} from "@/types/owner-site/components/navbar";
import { toast } from "sonner";
import { useWebsiteSocketContext } from "@/providers/website-socket-provider";

const NAVBAR_QUERY_KEY = ["navbar"];

export const useNavbarQuery = (enabled: boolean = true) => {
  const socket = useWebsiteSocketContext();
  return useQuery({
    queryKey: NAVBAR_QUERY_KEY,
    queryFn: () => {
      if (!socket.enabled) {
        return useNavbarApi.getNavbar();
      }
      return new Promise<any>((resolve, reject) => {
        let isFinished = false;

        const cleanup = () => {
          isFinished = true;
          unsubscribeSuccess();
          unsubscribeError();
          clearTimeout(timeoutId);
        };

        const unsubscribeSuccess = socket.subscribe("navbar", message => {
          if (isFinished) return;
          cleanup();
          resolve({
            data: message.data || null,
            message: message.data ? "Navbar retrieved" : "No navbar found",
          });
        });

        const unsubscribeError = socket.subscribe("socket_error", message => {
          if (isFinished) return;
          if (message.error === "Page not found") {
            cleanup();
            resolve({
              data: null,
              message: "Page not found",
            });
          }
        });

        const timeoutId = setTimeout(() => {
          if (isFinished) return;
          cleanup();
          reject(new Error("Timeout waiting for navbar"));
        }, 10000);

        socket.sendMessage({
          action: "get_navbar",
          status: "preview",
        });
      });
    },
    staleTime: 0,
    retry: 2,
    enabled,
  });
};

// use-navbar.ts updates
export const useCreateNavbarMutation = () => {
  const socket = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNavbarRequest) => {
      if (!socket.enabled) {
        return useNavbarApi.createNavbar(data);
      }
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = socket.subscribe("navbar_created", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        socket.sendMessage({
          action: "create_navbar",
          ...data,
        });
      });
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: NAVBAR_QUERY_KEY });
      const previousNavbar = queryClient.getQueryData(NAVBAR_QUERY_KEY);

      queryClient.setQueryData(NAVBAR_QUERY_KEY, {
        data: {
          ...variables,
          status: "draft",
          component_type: "navbar",
          isOptimistic: true,
        },
        message: "Navbar created/updated (optimistic)",
      });

      return { previousNavbar };
    },
    onSuccess: () => {
      toast.success("Navbar created successfully");
    },
    onError: (error: any, __, context) => {
      if (context?.previousNavbar) {
        queryClient.setQueryData(NAVBAR_QUERY_KEY, context.previousNavbar);
      }
      const errorMessage =
        error?.data?.detail ||
        error?.detail ||
        error?.message ||
        "Failed to create navbar";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateNavbarMutation = () => {
  const socket = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNavbarRequest) => {
      if (!socket.enabled) {
        return useNavbarApi.updateNavbar(data);
      }
      return new Promise<any>(resolve => {
        const unsubscribe = socket.subscribe("navbar_updated", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        socket.sendMessage({
          action: "update_navbar",
          ...data,
        });
      });
    },
    onMutate: async (data: UpdateNavbarRequest) => {
      await queryClient.cancelQueries({ queryKey: NAVBAR_QUERY_KEY });
      const previousNavbar = queryClient.getQueryData(NAVBAR_QUERY_KEY);

      queryClient.setQueryData(NAVBAR_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, ...data },
        };
      });

      return { previousNavbar };
    },
    onSuccess: data => {
      toast.success("Navbar updated successfully");
    },
    onError: (error: any, __, context) => {
      if (context?.previousNavbar) {
        queryClient.setQueryData(NAVBAR_QUERY_KEY, context.previousNavbar);
      }
      toast.error(error.message || "Failed to update navbar");
    },
  });
};

export const useDeleteNavbarMutation = () => {
  const socket = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!socket.enabled) {
        return useNavbarApi.deleteNavbar(id);
      }
      return new Promise<any>(resolve => {
        const unsubscribe = socket.subscribe("navbar_deleted", message => {
          const deletedId = message.id || message.data?.id;
          if (deletedId === id) {
            unsubscribe();
            resolve(message.data);
          }
        });
        setTimeout(() => unsubscribe(), 10000);

        socket.sendMessage({
          action: "delete_navbar",
          id: id,
        });
      });
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: NAVBAR_QUERY_KEY });
      queryClient.setQueryData(NAVBAR_QUERY_KEY, null);
      toast.success("Navbar deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete navbar");
    },
  });
};

export const useReplaceNavbarMutation = () => {
  const socket = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNavbarRequest) => {
      if (!socket.enabled) {
        return useNavbarApi.replaceNavbar(data);
      }
      return new Promise<any>(resolve => {
        const unsubscribe = socket.subscribe("navbar_replaced", message => {
          unsubscribe();
          resolve(message.data);
        });
        setTimeout(() => unsubscribe(), 10000);

        socket.sendMessage({
          action: "replace_navbar",
          ...data,
        });
      });
    },
    onMutate: async (data: CreateNavbarRequest) => {
      await queryClient.cancelQueries({ queryKey: NAVBAR_QUERY_KEY });
      const previousNavbar = queryClient.getQueryData(NAVBAR_QUERY_KEY);

      queryClient.setQueryData(NAVBAR_QUERY_KEY, {
        data: {
          ...data,
          status: "draft",
          component_type: "navbar",
          isOptimistic: true,
        },
        message: "Navbar replaced (optimistic)",
      });

      return { previousNavbar };
    },
    onSuccess: data => {
      toast.success("Navbar replaced successfully");
    },
    onError: (error: any, __, context) => {
      if (context?.previousNavbar) {
        queryClient.setQueryData(NAVBAR_QUERY_KEY, context.previousNavbar);
      }
      toast.error(error.message || "Failed to replace navbar");
    },
  });
};
