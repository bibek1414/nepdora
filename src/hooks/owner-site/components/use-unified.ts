import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { componentsApi } from "@/services/api/owner-sites/components/unified";
import {
  ComponentTypeMap,
  ComponentResponse,
} from "@/types/owner-site/components/components";
import { useWebsiteSocketContext } from "@/providers/website-socket-provider";

// Helper to generate UUID
const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Generic hook for fetching page components
export const usePageComponentsQuery = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageSlug: string,
  status: "preview" | "published" = "published"
) => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();

  return useQuery({
    queryKey: ["pageComponents", pageSlug, status],
    queryFn: () => {
      return new Promise<ComponentResponse<T>[]>((resolve, reject) => {
        const unsubscribe = subscribe("components_list", (message: any) => {
          unsubscribe();
          if (message.data) {
            resolve(message.data as ComponentResponse<T>[]);
          } else {
            resolve([]);
          }
        });

        // Timeout
        setTimeout(() => {
          unsubscribe();
          // If timeout, maybe return empty or throw?
          // Let's throw to trigger retry or error state
          reject(new Error("Timeout waiting for components list"));
        }, 10000);

        sendMessage({
          action: "list_components",
          slug: pageSlug,
          status,
        });
      });
    },
    enabled: !!pageSlug,
    // Since we are using sockets, maybe we don't need to refetch on window focus as much
    // if we have real-time updates.
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
export const usePageComponentsQueryPublished = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageSlug: string
) => {
  return usePageComponentsQuery<T>(pageSlug, "published");
};

// Generic hook for fetching components by type
export const useComponentsByTypeQuery = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T
) => {
  return useQuery({
    queryKey: ["pageComponents", pageSlug, componentType],
    queryFn: () =>
      componentsApi.getComponentsByType<T>(pageSlug, componentType),
    enabled: !!pageSlug && !!componentType,
  });
};

// Generic hook that can handle multiple component types in one instance
export const useCreateComponentMutation = (pageSlug: string) => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      componentType,
      data,
      insertIndex,
      silent,
    }: {
      componentType: keyof ComponentTypeMap;
      data: ComponentTypeMap[keyof ComponentTypeMap];
      insertIndex?: number;
      silent?: boolean;
    }) => {
      return new Promise<any>((resolve, reject) => {
        const unsubscribe = subscribe("component_created", (message: any) => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => {
          unsubscribe();
        }, 10000);

        sendMessage({
          action: "create_component",
          slug: pageSlug,
          component_type: componentType,
          component_id: generateUUID(),
          data,
          order: insertIndex,
        });
      });
    },
    onMutate: async variables => {
      const { componentType, data, insertIndex, silent } = variables;

      // Cancel refetching
      await queryClient.cancelQueries({
        queryKey: ["pageComponents", pageSlug, "preview"],
      });

      // Snapshot previous
      const previousComponents = queryClient.getQueryData([
        "pageComponents",
        pageSlug,
        "preview",
      ]);

      // Optimistically update
      const optimisticId = generateUUID();
      const optimisticComponent = {
        component_id: optimisticId,
        component_type: componentType,
        data: data,
        page_slug: pageSlug,
        status: "draft",
        order:
          insertIndex ??
          (Array.isArray(previousComponents) ? previousComponents.length : 0),
        isOptimistic: true, // For UI feedback if needed
      };

      queryClient.setQueryData(
        ["pageComponents", pageSlug, "preview"],
        (old: any[] | undefined) => {
          if (!old) return [optimisticComponent];
          const newList = [...old];
          if (typeof insertIndex === "number") {
            const spliceIndex = newList.findIndex(
              c => (c.order ?? 0) >= insertIndex
            );
            if (spliceIndex === -1) {
              newList.push(optimisticComponent);
            } else {
              newList.splice(spliceIndex, 0, optimisticComponent);
            }
          } else {
            newList.push(optimisticComponent);
          }
          return newList.map((c, i) => ({ ...c, order: i }));
        }
      );

      if (!silent) {
        return {
          previousComponents,
          optimisticId,
          toastId: toast.loading(
            `Adding ${
              componentType.charAt(0).toUpperCase() + componentType.slice(1)
            } component...`
          ),
        };
      }
      return { previousComponents, optimisticId };
    },
    onSuccess: (data, variables, context: any) => {
      // Replace or remove the optimistic component with the real data from the server
      if (context?.optimisticId && data) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          (old: any[] | undefined) => {
            if (!old) return [data];

            const realExists = old.some(
              c => c.component_id === data.component_id
            );
            if (realExists) {
              return old.filter(c => c.component_id !== context.optimisticId);
            }

            return old.map(c =>
              c.component_id === context.optimisticId
                ? { ...data, order: data.order ?? c.order }
                : c
            );
          }
        );
      }

      if (!variables.silent) {
        toast.success(
          `${
            variables.componentType.charAt(0).toUpperCase() +
            variables.componentType.slice(1)
          } component added successfully!`,
          { id: context?.toastId }
        );
      }
    },
    onError: (error: unknown, variables, context) => {
      // Rollback
      if (context?.previousComponents) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          context.previousComponents
        );
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to add ${variables.componentType} component`;
      if (!variables.silent) {
        toast.error(errorMessage, { id: context?.toastId });
      }
    },
  });
};

// Generic hook for updating components
export const useUpdateComponentMutation = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T
) => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      data,
    }: {
      componentId: string;
      data: Partial<ComponentTypeMap[T]>;
    }) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("component_updated", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "update_component",
          slug: pageSlug,
          component_id: componentId,
          data: data,
          component_type: componentType,
        });
      });
    },
    onMutate: async ({ componentId, data }) => {
      await queryClient.cancelQueries({
        queryKey: ["pageComponents", pageSlug, "preview"],
      });
      const previousComponents = queryClient.getQueryData([
        "pageComponents",
        pageSlug,
        "preview",
      ]);

      queryClient.setQueryData(
        ["pageComponents", pageSlug, "preview"],
        (old: any[] | undefined) => {
          if (!old) return old;
          return old.map(c =>
            c.component_id === componentId
              ? { ...c, data: { ...c.data, ...data } }
              : c
          );
        }
      );

      return { previousComponents };
    },
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          (old: any[] | undefined) => {
            if (!old) return old;
            return old.map(c =>
              c.component_id === variables.componentId
                ? { ...c, ...data, data: { ...c.data, ...(data.data || {}) } }
                : c
            );
          }
        );
      }
      toast.success("Component updated successfully");
    },
    onError: (error: unknown, __, context) => {
      if (context?.previousComponents) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          context.previousComponents
        );
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to update ${componentType} component`;
      toast.error(errorMessage);
    },
  });
};

// Generic hook for deleting components
export const useDeleteComponentMutation = (
  pageSlug: string,
  componentType: keyof ComponentTypeMap
) => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentId: string) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("component_deleted", message => {
          if (
            message.component_id === componentId ||
            (message.data && message.data.component_id === componentId)
          ) {
            unsubscribe();
            resolve(message.data);
          }
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "delete_component",
          page_slug: pageSlug,
          component_id: componentId,
          component_type: componentType,
        });
      });
    },
    onMutate: async componentId => {
      await queryClient.cancelQueries({
        queryKey: ["pageComponents", pageSlug, "preview"],
      });
      const previousComponents = queryClient.getQueryData([
        "pageComponents",
        pageSlug,
        "preview",
      ]);

      queryClient.setQueryData(
        ["pageComponents", pageSlug, "preview"],
        (old: any[] | undefined) => {
          if (!old) return old;
          return old.filter(c => c.component_id !== componentId);
        }
      );

      return {
        previousComponents,
        toastId: toast.loading(
          `Deleting ${
            componentType.charAt(0).toUpperCase() + componentType.slice(1)
          } component...`
        ),
      };
    },
    onSuccess: (_, __, context) => {
      toast.success(
        `${
          componentType.charAt(0).toUpperCase() + componentType.slice(1)
        } component deleted successfully!`,
        { id: context?.toastId }
      );
    },
    onError: (error: unknown, __, context) => {
      if (context?.previousComponents) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          context.previousComponents
        );
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to delete ${componentType} component`;
      toast.error(errorMessage, { id: context?.toastId });
    },
  });
};

// Generic hook for replacing components
export const useReplaceComponentMutation = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T
) => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      data,
    }: {
      componentId: string;
      data: ComponentTypeMap[T];
    }) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("component_replaced", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "replace_component",
          page_slug: pageSlug,
          component_id: componentId,
          component_type: componentType,
          data,
        });
      });
    },
    onMutate: async ({ componentId, data }) => {
      await queryClient.cancelQueries({
        queryKey: ["pageComponents", pageSlug, "preview"],
      });
      const previousComponents = queryClient.getQueryData([
        "pageComponents",
        pageSlug,
        "preview",
      ]);

      queryClient.setQueryData(
        ["pageComponents", pageSlug, "preview"],
        (old: any[] | undefined) => {
          if (!old) return old;
          return old.map(c =>
            c.component_id === componentId
              ? { ...c, component_type: componentType, data }
              : c
          );
        }
      );

      return {
        previousComponents,
        toastId: toast.loading(`${componentType} component replacing...`),
      };
    },
    onSuccess: (data, variables, context) => {
      if (data) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          (old: any[] | undefined) => {
            if (!old) return old;
            return old.map(c =>
              c.component_id === variables.componentId
                ? { ...c, ...data, data: { ...c.data, ...(data.data || {}) } }
                : c
            );
          }
        );
      }
      toast.success(`${componentType} component replaced successfully!`, {
        id: context?.toastId,
      });
    },
    onError: (error: unknown, __, context) => {
      if (context?.previousComponents) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          context.previousComponents
        );
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to replace ${componentType} component`;
      toast.error(errorMessage, { id: context?.toastId });
    },
  });
};

// Generic replace mutation hook
export const useGenericReplaceComponentMutation = (pageSlug: string) => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      componentType,
      data,
      order,
    }: {
      componentId: string;
      componentType: keyof ComponentTypeMap;
      data: ComponentTypeMap[keyof ComponentTypeMap];
      order?: number;
    }) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("component_replaced", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "replace_component",
          page_slug: pageSlug,
          component_id: componentId,
          component_type: componentType,
          data,
          order,
        });
      });
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({
        queryKey: ["pageComponents", pageSlug, "preview"],
      });
      const previousComponents = queryClient.getQueryData([
        "pageComponents",
        pageSlug,
        "preview",
      ]);

      queryClient.setQueryData(
        ["pageComponents", pageSlug, "preview"],
        (old: any[] | undefined) => {
          if (!old) return old;
          return old
            .map(c =>
              c.component_id === variables.componentId
                ? {
                    ...c,
                    component_type: variables.componentType,
                    data: variables.data,
                    order: variables.order ?? c.order,
                  }
                : c
            )
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
      );

      return {
        previousComponents,
        toastId: toast.loading(
          `Replacing ${variables.componentType} component...`
        ),
      };
    },
    onSuccess: (data, variables, context) => {
      if (data) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          (old: any[] | undefined) => {
            if (!old) return old;
            return old.map(c =>
              c.component_id === variables.componentId
                ? { ...c, ...data, data: { ...c.data, ...(data.data || {}) } }
                : c
            );
          }
        );
      }
      toast.success(
        `${variables.componentType} component replaced successfully!`,
        { id: context?.toastId }
      );
    },
    onError: (error: unknown, variables, context) => {
      if (context?.previousComponents) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          context.previousComponents
        );
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to replace ${variables.componentType} component`;
      toast.error(errorMessage, { id: context?.toastId });
    },
  });
};

// Deprecated or specific portfolio delete - map to generic delete
export const useDeletePortfolioComponentMutation = () => {
  const { sendMessage } = useWebsiteSocketContext();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => {
      sendMessage({
        action: "delete_component",
        data: {
          page_slug: pageSlug,
          component_id: componentId,
          component_type: "portfolio",
        },
      });
      return Promise.resolve();
    },
    onMutate: () => {
      return {
        toastId: toast.loading("Removing portfolio section..."),
      };
    },
    onSuccess: (_, variables, context) => {
      toast.success("Portfolio section removed successfully!", {
        id: context?.toastId,
      });
    },
    onError: (error: unknown, __, context) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove portfolio section";
      toast.error(errorMessage, { id: context?.toastId });
    },
  });
};

export const useUpdateComponentOrderMutation = (pageSlug: string) => {
  const { sendMessage, subscribe } = useWebsiteSocketContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderUpdates }: { orderUpdates: any[] }) => {
      return new Promise<any>(resolve => {
        const unsubscribe = subscribe("component_order_updated", message => {
          unsubscribe();
          resolve(message.data);
        });

        setTimeout(() => unsubscribe(), 10000);

        sendMessage({
          action: "update_component_order",
          slug: pageSlug,
          order_updates: orderUpdates,
        });
      });
    },
    onMutate: async ({ orderUpdates }) => {
      await queryClient.cancelQueries({
        queryKey: ["pageComponents", pageSlug, "preview"],
      });
      const previousComponents = queryClient.getQueryData([
        "pageComponents",
        pageSlug,
        "preview",
      ]);

      queryClient.setQueryData(
        ["pageComponents", pageSlug, "preview"],
        (old: any[] | undefined) => {
          if (!old) return old;
          const newComponents = old.map(c => {
            const update = orderUpdates.find(
              u => u.component_id === c.component_id
            );
            return update ? { ...c, order: update.order } : c;
          });
          return [...newComponents].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          );
        }
      );

      return { previousComponents };
    },
    onSuccess: data => {
      if (Array.isArray(data)) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );
      }
      toast.success("Component order updated successfully!");
    },
    onError: (error: unknown, __, context) => {
      if (context?.previousComponents) {
        queryClient.setQueryData(
          ["pageComponents", pageSlug, "preview"],
          context.previousComponents
        );
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update component order";
      console.error("Order update error:", error);
      toast.error(errorMessage);
    },
  });
};
