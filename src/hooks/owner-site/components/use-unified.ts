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

export const useCreateComponentMutation = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      insertIndex,
    }: {
      data: ComponentTypeMap[T];
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
    onSuccess: () => {
      // Debounce invalidation
      if (invalidationTimeout) clearTimeout(invalidationTimeout);

      invalidationTimeout = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["pageComponents", pageSlug],
        });
        toast.success(`${componentType} component created successfully!`);
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

// Specific component hooks using the generic ones
export const useHeroComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "hero"),
  create: useCreateComponentMutation(pageSlug, "hero"),
  update: useUpdateComponentMutation(pageSlug, "hero"),
  delete: useDeleteComponentMutation(pageSlug, "hero"),
});
export const usePortfolioComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "portfolio"),
  create: useCreateComponentMutation(pageSlug, "portfolio"),
  update: useUpdateComponentMutation(pageSlug, "portfolio"),
  delete: useDeleteComponentMutation(pageSlug, "portfolio"),
});

export const useAboutComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "about"),
  create: useCreateComponentMutation(pageSlug, "about"),
  update: useUpdateComponentMutation(pageSlug, "about"),
  delete: useDeleteComponentMutation(pageSlug, "about"),
});

export const useBlogComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "blog"),
  create: useCreateComponentMutation(pageSlug, "blog"),
  update: useUpdateComponentMutation(pageSlug, "blog"),
  delete: useDeleteComponentMutation(pageSlug, "blog"),
});

export const useProductComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "products"),
  create: useCreateComponentMutation(pageSlug, "products"),
  update: useUpdateComponentMutation(pageSlug, "products"),
  delete: useDeleteComponentMutation(pageSlug, "products"),
});

// NEW: Category component hooks
export const useCategoryComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "category"),
  create: useCreateComponentMutation(pageSlug, "category"),
  update: useUpdateComponentMutation(pageSlug, "category"),
  delete: useDeleteComponentMutation(pageSlug, "category"),
});

// NEW: SubCategory component hooks
export const useSubCategoryComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "subcategory"),
  create: useCreateComponentMutation(pageSlug, "subcategory"),
  update: useUpdateComponentMutation(pageSlug, "subcategory"),
  delete: useDeleteComponentMutation(pageSlug, "subcategory"),
});

export const useTeamComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "team"),
  create: useCreateComponentMutation(pageSlug, "team"),
  update: useUpdateComponentMutation(pageSlug, "team"),
  delete: useDeleteComponentMutation(pageSlug, "team"),
});

export const useTestimonialsComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "testimonials"),
  create: useCreateComponentMutation(pageSlug, "testimonials"),
  update: useUpdateComponentMutation(pageSlug, "testimonials"),
  delete: useDeleteComponentMutation(pageSlug, "testimonials"),
});

export const useFAQComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "faq"),
  create: useCreateComponentMutation(pageSlug, "faq"),
  update: useUpdateComponentMutation(pageSlug, "faq"),
  delete: useDeleteComponentMutation(pageSlug, "faq"),
});

// Existing specialized mutation hooks
export const useCreateTestimonialsComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "testimonials");

export const useUpdateTestimonialsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["testimonials"]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        { data },
        "testimonials"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Testimonials section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update testimonials section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteTestimonialsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "testimonials"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Testimonials section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove testimonials section";
      toast.error(errorMessage);
    },
  });
};

// NEW: Category specific mutation hooks
export const useCreateCategoryComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "category");

export const useUpdateCategoryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["category"]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        { data },
        "category"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Category section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update category section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteCategoryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "category"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Category section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove category section";
      toast.error(errorMessage);
    },
  });
};

// NEW: SubCategory specific mutation hooks
export const useCreateSubCategoryComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "subcategory");

export const useUpdateSubCategoryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["subcategory"]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        { data },
        "subcategory"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("SubCategory section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update subcategory section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteSubCategoryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "subcategory"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("SubCategory section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove subcategory section";
      toast.error(errorMessage);
    },
  });
};

// Other existing hooks remain the same...
export const useCreateHeroMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "hero");

export const useUpdateHeroMutation = (pageSlug: string) =>
  useUpdateComponentMutation(pageSlug, "hero");

export const useDeleteHeroMutation = (pageSlug: string) =>
  useDeleteComponentMutation(pageSlug, "hero");

export const useCreateAboutUsMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "about");

export const useUpdateAboutUsMutation = (pageSlug: string) =>
  useUpdateComponentMutation(pageSlug, "about");

export const useDeleteAboutUsMutation = (pageSlug: string) =>
  useDeleteComponentMutation(pageSlug, "about");

export const useCreateBlogComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "blog");

export const useUpdateBlogComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["blog"]>;
    }) =>
      componentsApi.updateComponent(pageSlug, componentId, { data }, "blog"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Blog section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update blog section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteBlogComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "blog"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Blog section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove blog section";
      toast.error(errorMessage);
    },
  });
};

export const useCreateProductsComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "products");

export const useUpdateProductsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["products"]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        { data },
        "products"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Products section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update products section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteProductsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "products"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Products section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove products section";
      toast.error(errorMessage);
    },
  });
};

export const useCreateFAQComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "faq");

export const useUpdateFAQComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["faq"]>;
    }) => componentsApi.updateComponent(pageSlug, componentId, { data }, "faq"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("FAQ section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update FAQ section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteFAQComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "faq"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("FAQ section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove FAQ section";
      toast.error(errorMessage);
    },
  });
};
export const useCreatePortfolioComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "portfolio");

export const useUpdatePortfolioComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["portfolio"]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        { data },
        "portfolio"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Portfolio section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update portfolio section";
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
export const useBannerComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "banner"),
  create: useCreateComponentMutation(pageSlug, "banner"),
  update: useUpdateComponentMutation(pageSlug, "banner"),
  delete: useDeleteComponentMutation(pageSlug, "banner"),
});

export const useCreateBannerComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "banner");

export const useUpdateBannerComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["banner"]>;
    }) =>
      componentsApi.updateComponent(pageSlug, componentId, { data }, "banner"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Banner section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update banner section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteBannerComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "banner"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Banner section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove banner section";
      toast.error(errorMessage);
    },
  });
};
export const useNewsletterComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "newsletter"),
  create: useCreateComponentMutation(pageSlug, "newsletter"),
  update: useUpdateComponentMutation(pageSlug, "newsletter"),
  delete: useDeleteComponentMutation(pageSlug, "newsletter"),
});

export const useCreateNewsletterComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "newsletter");

export const useUpdateNewsletterComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["newsletter"]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        { data },
        "newsletter"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Newsletter section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update newsletter section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteNewsletterComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "newsletter"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Newsletter section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove newsletter section";
      toast.error(errorMessage);
    },
  });
};
export const useYouTubeComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "videos"),
  create: useCreateComponentMutation(pageSlug, "videos"),
  update: useUpdateComponentMutation(pageSlug, "videos"),
  delete: useDeleteComponentMutation(pageSlug, "videos"),
});

export const useCreateYouTubeComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "videos");

export const useUpdateYouTubeComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["videos"]>;
    }) =>
      componentsApi.updateComponent(pageSlug, componentId, { data }, "videos"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("YouTube section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update YouTube section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteYouTubeComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "videos"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("YouTube section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove YouTube section";
      toast.error(errorMessage);
    },
  });
};

export const useGalleryComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "gallery"),
  create: useCreateComponentMutation(pageSlug, "gallery"),
  update: useUpdateComponentMutation(pageSlug, "gallery"),
  delete: useDeleteComponentMutation(pageSlug, "gallery"),
});

export const useCreateGalleryComponentMutation = (pageSlug: string) =>
  useCreateComponentMutation(pageSlug, "gallery");

export const useUpdateGalleryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["gallery"]>;
    }) =>
      componentsApi.updateComponent(pageSlug, componentId, { data }, "gallery"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Gallery section updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update gallery section";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteGalleryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) => componentsApi.deleteComponent(pageSlug, componentId, "gallery"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug],
      });
      toast.success("Gallery section removed successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove gallery section";
      toast.error(errorMessage);
    },
  });
};
