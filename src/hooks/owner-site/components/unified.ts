import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  componentsApi,
  componentOrdersApi,
  BulkOrderUpdateRequest,
} from "@/services/api/owner-sites/components/unified";
import {
  ComponentTypeMap,
  ComponentResponse,
} from "@/types/owner-site/components/components";

// Generic hook for fetching page components
export const usePageComponentsQuery = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageId: string | number // Changed from pageSlug
) => {
  return useQuery({
    queryKey: ["pageComponents", pageId],
    queryFn: () => componentsApi.getPageComponents<T>(pageId),
    enabled: !!pageId,
  });
};

export const usePageComponentsQueryPublished = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageId: string | number // Changed from pageSlug
) => {
  return useQuery({
    queryKey: ["pageComponents", pageId],
    queryFn: () => componentsApi.getPageComponentsPublished<T>(pageId),
    enabled: !!pageId,
  });
};

// Generic hook for fetching components by type
export const useComponentsByTypeQuery = <T extends keyof ComponentTypeMap>(
  pageId: string | number, // Changed from pageSlug
  componentType: T
) => {
  return useQuery({
    queryKey: ["pageComponents", pageId, componentType],
    queryFn: () => componentsApi.getComponentsByType<T>(pageId, componentType),
    enabled: !!pageId && !!componentType,
  });
};

// Generic hook for creating components
export const useCreateComponentMutation = <T extends keyof ComponentTypeMap>(
  pageId: string | number, // Changed from pageSlug
  componentType: T
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ComponentTypeMap[T]) => {
      const existingComponents = await componentsApi.getPageComponents(pageId);
      return componentsApi.createComponent(
        pageId,
        {
          component_type: componentType,
          data,
        },
        existingComponents
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageId] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageId, componentType],
      });
      toast.success(`${componentType} component created successfully!`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to create ${componentType} component`;
      toast.error(errorMessage);
    },
  });
};

// Generic hook for updating components
export const useUpdateComponentMutation = <T extends keyof ComponentTypeMap>(
  pageId: string | number, // Changed from pageSlug
  componentType: T
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number; // Changed from componentId
      data: Partial<ComponentTypeMap[T]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, componentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageId] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageId, componentType],
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
  pageId: string | number, // Changed from pageSlug
  componentType: keyof ComponentTypeMap
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: string | number // Changed from componentId
    ) => componentsApi.deleteComponent(pageId, id, componentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageId] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageId, componentType],
      });
      toast.success(`${componentType} component deleted successfully!`);
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

// Specific component hooks using the generic ones
export const useHeroComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "hero"),
  create: useCreateComponentMutation(pageId, "hero"),
  update: useUpdateComponentMutation(pageId, "hero"),
  delete: useDeleteComponentMutation(pageId, "hero"),
});

export const usePortfolioComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "portfolio"),
  create: useCreateComponentMutation(pageId, "portfolio"),
  update: useUpdateComponentMutation(pageId, "portfolio"),
  delete: useDeleteComponentMutation(pageId, "portfolio"),
});

export const useAboutComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "about"),
  create: useCreateComponentMutation(pageId, "about"),
  update: useUpdateComponentMutation(pageId, "about"),
  delete: useDeleteComponentMutation(pageId, "about"),
});

export const useBlogComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "blog"),
  create: useCreateComponentMutation(pageId, "blog"),
  update: useUpdateComponentMutation(pageId, "blog"),
  delete: useDeleteComponentMutation(pageId, "blog"),
});

export const useProductComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "products"),
  create: useCreateComponentMutation(pageId, "products"),
  update: useUpdateComponentMutation(pageId, "products"),
  delete: useDeleteComponentMutation(pageId, "products"),
});

export const useCategoryComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "category"),
  create: useCreateComponentMutation(pageId, "category"),
  update: useUpdateComponentMutation(pageId, "category"),
  delete: useDeleteComponentMutation(pageId, "category"),
});

export const useSubCategoryComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "subcategory"),
  create: useCreateComponentMutation(pageId, "subcategory"),
  update: useUpdateComponentMutation(pageId, "subcategory"),
  delete: useDeleteComponentMutation(pageId, "subcategory"),
});

export const useTeamComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "team"),
  create: useCreateComponentMutation(pageId, "team"),
  update: useUpdateComponentMutation(pageId, "team"),
  delete: useDeleteComponentMutation(pageId, "team"),
});

export const useTestimonialsComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "testimonials"),
  create: useCreateComponentMutation(pageId, "testimonials"),
  update: useUpdateComponentMutation(pageId, "testimonials"),
  delete: useDeleteComponentMutation(pageId, "testimonials"),
});

export const useFAQComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "faq"),
  create: useCreateComponentMutation(pageId, "faq"),
  update: useUpdateComponentMutation(pageId, "faq"),
  delete: useDeleteComponentMutation(pageId, "faq"),
});

export const useBannerComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "banner"),
  create: useCreateComponentMutation(pageId, "banner"),
  update: useUpdateComponentMutation(pageId, "banner"),
  delete: useDeleteComponentMutation(pageId, "banner"),
});

export const useNewsletterComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "newsletter"),
  create: useCreateComponentMutation(pageId, "newsletter"),
  update: useUpdateComponentMutation(pageId, "newsletter"),
  delete: useDeleteComponentMutation(pageId, "newsletter"),
});

export const useYouTubeComponents = (pageId: string | number) => ({
  query: useComponentsByTypeQuery(pageId, "youtube"),
  create: useCreateComponentMutation(pageId, "youtube"),
  update: useUpdateComponentMutation(pageId, "youtube"),
  delete: useDeleteComponentMutation(pageId, "youtube"),
});

// Specialized mutation hooks that don't need pageId in hook params
export const useUpdateTestimonialsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["testimonials"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "testimonials"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "testimonials"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateComponentOrderMutation = (pageId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderUpdates }: BulkOrderUpdateRequest) =>
      componentOrdersApi.updateComponentOrders(pageId, orderUpdates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageId] });
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      toast.success("Component order updated successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update component order";
      console.error("Order update error:", error);
      toast.error(errorMessage);
    },
  });
};

// Legacy mutation hooks for backward compatibility (if needed)
export const useCreateTestimonialsComponentMutation = (
  pageId: string | number
) => useCreateComponentMutation(pageId, "testimonials");

export const useCreateHeroMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "hero");

export const useUpdateHeroMutation = (pageId: string | number) =>
  useUpdateComponentMutation(pageId, "hero");

export const useDeleteHeroMutation = (pageId: string | number) =>
  useDeleteComponentMutation(pageId, "hero");

export const useCreateAboutUsMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "about");

export const useUpdateAboutUsMutation = (pageId: string | number) =>
  useUpdateComponentMutation(pageId, "about");

export const useDeleteAboutUsMutation = (pageId: string | number) =>
  useDeleteComponentMutation(pageId, "about");

export const useCreateBlogComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "blog");

export const useCreateProductsComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "products");

export const useCreateFAQComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "faq");

export const useCreatePortfolioComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "portfolio");

export const useCreateBannerComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "banner");

export const useCreateNewsletterComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "newsletter");

export const useCreateYouTubeComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "youtube");

export const useCreateCategoryComponentMutation = (pageId: string | number) =>
  useCreateComponentMutation(pageId, "category");

export const useCreateSubCategoryComponentMutation = (
  pageId: string | number
) => useCreateComponentMutation(pageId, "subcategory");

// Additional specialized update/delete mutations
export const useUpdateBlogComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["blog"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "blog"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "blog"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateProductsComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["products"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "products"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "products"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateFAQComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["faq"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "faq"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "faq"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdatePortfolioComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["portfolio"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "portfolio"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "portfolio"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateBannerComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["banner"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "banner"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "banner"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateNewsletterComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["newsletter"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "newsletter"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "newsletter"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateYouTubeComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["youtube"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "youtube"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "youtube"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateCategoryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["category"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "category"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "category"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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

export const useUpdateSubCategoryComponentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      id,
      data,
    }: {
      pageId: string | number;
      id: string | number;
      data: Partial<ComponentTypeMap["subcategory"]>;
    }) => componentsApi.updateComponent(pageId, id, { data }, "subcategory"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
      pageId,
      id,
    }: {
      pageId: string | number;
      id: string | number;
    }) => componentsApi.deleteComponent(pageId, id, "subcategory"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageId],
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
