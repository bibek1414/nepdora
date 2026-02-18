import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavbarApi } from "@/services/api/owner-sites/components/navbar";
import {
  CreateNavbarRequest,
  UpdateNavbarRequest,
} from "@/types/owner-site/components/navbar";
import { toast } from "sonner";
import { useWebsiteSocketContext } from "@/providers/website-socket-provider";

const NAVBAR_QUERY_KEY = ["navbar"];

export const useNavbarQuery = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  return useQuery({
    queryKey: NAVBAR_QUERY_KEY,
    queryFn: () => {
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = subscribe("navbar", message => {
          unsubscribe();
          resolve({
            data: message.data || null,
            message: message.data ? "Navbar retrieved" : "No navbar found",
          });
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for navbar"));
        }, 10000);

        sendMessage({
          action: "get_navbar",
          status: "preview",
        });
      });
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useNavbarQueryPublished = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  return useQuery({
    queryKey: [...NAVBAR_QUERY_KEY, "published"],
    queryFn: () => {
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = subscribe("navbar", message => {
          unsubscribe();
          resolve({
            data: message.data || null,
            message: message.data ? "Navbar retrieved" : "No navbar found",
          });
        });

        setTimeout(() => {
          unsubscribe();
          reject(new Error("Timeout waiting for published navbar"));
        }, 10000);

        sendMessage({
          action: "get_navbar",
          status: "published",
        });
      });
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// use-navbar.ts updates
export const useCreateNavbarMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNavbarRequest) => {
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = subscribe("navbar_created", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "create_navbar",
          ...data,
        });
      });
    },
    onSuccess: data => {
      // Global listener invalidates, but we can toast
      toast.success("Navbar created/updated successfully");
    },
    onError: (error: any) => {
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
  const { sendMessage, subscribe } = useWebsiteSocketContext();

  return useMutation({
    mutationFn: async (data: UpdateNavbarRequest) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("navbar_updated", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "update_navbar",
          ...data,
        });
      });
    },
    onSuccess: data => {
      toast.success("Navbar updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update navbar");
    },
  });
};

export const useDeleteNavbarMutation = () => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("navbar_deleted", message => {
          const deletedId = message.id || message.data?.id;
          if (deletedId === id) {
            unsubscribe();
            resolve(message.data);
          }
        });
        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
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
  const { sendMessage, subscribe } = useWebsiteSocketContext();

  return useMutation({
    mutationFn: async (data: CreateNavbarRequest) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("navbar_replaced", message => {
          unsubscribe();
          resolve(message.data);
        });
        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "replace_navbar",
          ...data,
        });
      });
    },
    onSuccess: data => {
      toast.success("Navbar replaced successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to replace navbar");
    },
  });
};
