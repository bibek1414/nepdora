import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  componentsApi,
  componentOrdersApi,
  BulkOrderUpdateRequest,
} from "@/services/api/owner-sites/components/unified";
import { ComponentTypeMap } from "@/types/owner-site/components/components";

// Generic hook for fetching page components
export const usePageComponentsQuery = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageSlug: string
) => {
  return useQuery({
    queryKey: ["pageComponents", pageSlug],
    queryFn: () => componentsApi.getPageComponents<T>(pageSlug),
    enabled: !!pageSlug,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
export const usePageComponentsQueryPublished = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageSlug: string
) => {
  return useQuery({
    queryKey: ["pageComponents", pageSlug],
    queryFn: () => componentsApi.getPageComponentsPublished<T>(pageSlug),
    enabled: !!pageSlug,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
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

let invalidationTimeout: NodeJS.Timeout | null = null;

// Generic hook that can handle multiple component types in one instance
export const useCreateComponentMutation = (pageSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      componentType,
      data,
      insertIndex,
    }: {
      componentType: keyof ComponentTypeMap;
      data: ComponentTypeMap[keyof ComponentTypeMap];
      insertIndex?: number;
    }) => {
      const existingComponents =
        await componentsApi.getPageComponents(pageSlug);
      return componentsApi.createComponent(
        pageSlug,
        { component_type: componentType, data },
        existingComponents,
        insertIndex
      );
    },
    onSuccess: (_, variables) => {
      if (invalidationTimeout) clearTimeout(invalidationTimeout);

      invalidationTimeout = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["pageComponents", pageSlug],
        });
      }, 300);
    },
  });
};

// Generic hook for updating components
export const useUpdateComponentMutation = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      data,
    }: {
      componentId: string;
      data: Partial<ComponentTypeMap[T]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        { data },
        componentType
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, componentType],
      });
      toast.success(`${componentType} component updated successfully!`);
    },
    onError: (error: unknown) => {
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentId: string) =>
      componentsApi.deleteComponent(pageSlug, componentId, componentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, componentType],
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to delete ${componentType} component`;
      toast.error(errorMessage);
    },
  });
};

// Generic hook for replacing components
export const useReplaceComponentMutation = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      componentId,
      data,
    }: {
      componentId: string;
      data: ComponentTypeMap[T];
    }) =>
      componentsApi.replaceComponent(pageSlug, componentId, {
        component_type: componentType,
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, componentType],
      });
      toast.success(`${componentType} component replaced successfully!`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to replace ${componentType} component`;
      toast.error(errorMessage);
    },
  });
};

// Generic replace mutation hook
export const useGenericReplaceComponentMutation = (pageSlug: string) => {
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
    }) =>
      componentsApi.replaceComponent(pageSlug, componentId, {
        component_type: componentType,
        data,
        order,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, variables.componentType],
      });
      toast.success(
        `${variables.componentType} component replaced successfully!`
      );
    },
    onError: (error: unknown, variables) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to replace ${variables.componentType} component`;
      toast.error(errorMessage);
    },
  });
};

export const useDeletePortfolioComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "portfolio"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Portfolio section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove portfolio section";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateComponentOrderMutation = (pageSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderUpdates }: BulkOrderUpdateRequest) =>
      componentOrdersApi.updateComponentOrders(pageSlug, orderUpdates),
    onSuccess: () => {
      // Silently invalidate and refetch - no toast for background order updates
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update component order";
      console.error("Order update error:", error);
      // Only show toast on actual errors
      toast.error(errorMessage);
    },
  });
};
