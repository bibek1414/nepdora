import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  componentsApi,
  componentOrdersApi,
  BulkOrderUpdateRequest,
} from "@/services/api/super-admin/components/unified";
import { ComponentTypeMap } from "@/types/owner-site/components/components";

// Generic hook for fetching page components
export const usePageComponentsQuery = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageSlug: string,
  templateSlug: string
) => {
  return useQuery({
    queryKey: ["pageComponents", pageSlug, templateSlug],
    queryFn: () => componentsApi.getPageComponents<T>(pageSlug, templateSlug),
    enabled: !!pageSlug && !!templateSlug,
  });
};

export const usePageComponentsQueryPublished = <
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
>(
  pageSlug: string,
  templateSlug: string
) => {
  return useQuery({
    queryKey: ["pageComponents", pageSlug, templateSlug],
    queryFn: () =>
      componentsApi.getPageComponentsPublished<T>(pageSlug, templateSlug),
    enabled: !!pageSlug && !!templateSlug,
  });
};

// Generic hook for fetching components by type
export const useComponentsByTypeQuery = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T,
  templateSlug: string
) => {
  return useQuery({
    queryKey: ["pageComponents", pageSlug, componentType, templateSlug],
    queryFn: () =>
      componentsApi.getComponentsByType<T>(
        pageSlug,
        componentType,
        templateSlug
      ),
    enabled: !!pageSlug && !!componentType && !!templateSlug,
  });
};

// Generic hook for creating components
export const useCreateComponentMutation = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T,
  templateSlug: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ComponentTypeMap[T]) => {
      // Get existing components to calculate proper order
      const existingComponents = await componentsApi.getPageComponents(
        pageSlug,
        templateSlug
      );

      return componentsApi.createComponent(
        pageSlug,
        templateSlug,
        {
          component_type: componentType,
          data,
        },
        existingComponents
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, templateSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, componentType, templateSlug],
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
  pageSlug: string,
  componentType: T,
  templateSlug: string
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
        templateSlug,
        { data },
        componentType
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, templateSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, componentType, templateSlug],
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
  componentType: keyof ComponentTypeMap,
  templateSlug: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentId: string) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        componentType
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, templateSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, componentType, templateSlug],
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
export const useHeroComponents = (pageSlug: string, templateSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "hero", templateSlug),
  create: useCreateComponentMutation(pageSlug, "hero", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "hero", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "hero", templateSlug),
});

export const usePortfolioComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "portfolio", templateSlug),
  create: useCreateComponentMutation(pageSlug, "portfolio", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "portfolio", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "portfolio", templateSlug),
});

export const useAboutComponents = (pageSlug: string, templateSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "about", templateSlug),
  create: useCreateComponentMutation(pageSlug, "about", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "about", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "about", templateSlug),
});

export const useBlogComponents = (pageSlug: string, templateSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "blog", templateSlug),
  create: useCreateComponentMutation(pageSlug, "blog", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "blog", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "blog", templateSlug),
});

export const useProductComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "products", templateSlug),
  create: useCreateComponentMutation(pageSlug, "products", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "products", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "products", templateSlug),
});

// Category component hooks
export const useCategoryComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "category", templateSlug),
  create: useCreateComponentMutation(pageSlug, "category", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "category", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "category", templateSlug),
});

// SubCategory component hooks
export const useSubCategoryComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "subcategory", templateSlug),
  create: useCreateComponentMutation(pageSlug, "subcategory", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "subcategory", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "subcategory", templateSlug),
});

export const useTeamComponents = (pageSlug: string, templateSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "team", templateSlug),
  create: useCreateComponentMutation(pageSlug, "team", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "team", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "team", templateSlug),
});

export const useTestimonialsComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "testimonials", templateSlug),
  create: useCreateComponentMutation(pageSlug, "testimonials", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "testimonials", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "testimonials", templateSlug),
});

export const useFAQComponents = (pageSlug: string, templateSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "faq", templateSlug),
  create: useCreateComponentMutation(pageSlug, "faq", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "faq", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "faq", templateSlug),
});

// Existing specialized mutation hooks
export const useCreateTestimonialsComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "testimonials", templateSlug);

export const useUpdateTestimonialsComponentMutation = (
  templateSlug: string
) => {
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
        templateSlug,
        { data },
        "testimonials"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteTestimonialsComponentMutation = (
  templateSlug: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "testimonials"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

// Category specific mutation hooks
export const useCreateCategoryComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "category", templateSlug);

export const useUpdateCategoryComponentMutation = (templateSlug: string) => {
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
        templateSlug,
        { data },
        "category"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteCategoryComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "category"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

// SubCategory specific mutation hooks
export const useCreateSubCategoryComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "subcategory", templateSlug);

export const useUpdateSubCategoryComponentMutation = (templateSlug: string) => {
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
        templateSlug,
        { data },
        "subcategory"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteSubCategoryComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "subcategory"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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
export const useCreateHeroMutation = (pageSlug: string, templateSlug: string) =>
  useCreateComponentMutation(pageSlug, "hero", templateSlug);

export const useUpdateHeroMutation = (pageSlug: string, templateSlug: string) =>
  useUpdateComponentMutation(pageSlug, "hero", templateSlug);

export const useDeleteHeroMutation = (pageSlug: string, templateSlug: string) =>
  useDeleteComponentMutation(pageSlug, "hero", templateSlug);

export const useCreateAboutUsMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "about", templateSlug);

export const useUpdateAboutUsMutation = (
  pageSlug: string,
  templateSlug: string
) => useUpdateComponentMutation(pageSlug, "about", templateSlug);

export const useDeleteAboutUsMutation = (
  pageSlug: string,
  templateSlug: string
) => useDeleteComponentMutation(pageSlug, "about", templateSlug);

export const useCreateBlogComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "blog", templateSlug);

export const useUpdateBlogComponentMutation = (templateSlug: string) => {
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
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        templateSlug,
        { data },
        "blog"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteBlogComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "blog"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useCreateProductsComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "products", templateSlug);

export const useUpdateProductsComponentMutation = (templateSlug: string) => {
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
        templateSlug,
        { data },
        "products"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteProductsComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "products"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useCreateFAQComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "faq", templateSlug);

export const useUpdateFAQComponentMutation = (templateSlug: string) => {
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
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        templateSlug,
        { data },
        "faq"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteFAQComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(pageSlug, componentId, templateSlug, "faq"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useCreatePortfolioComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "portfolio", templateSlug);

export const useUpdatePortfolioComponentMutation = (templateSlug: string) => {
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
        templateSlug,
        { data },
        "portfolio"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeletePortfolioComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "portfolio"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useUpdateComponentOrderMutation = (
  pageSlug: string,
  templateSlug: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderUpdates }: BulkOrderUpdateRequest) =>
      componentOrdersApi.updateComponentOrders(
        pageSlug,
        templateSlug,
        orderUpdates
      ),
    onSuccess: () => {
      // Invalidate and refetch page components to get updated order
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, templateSlug],
      });
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

export const useBannerComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "banner", templateSlug),
  create: useCreateComponentMutation(pageSlug, "banner", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "banner", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "banner", templateSlug),
});

export const useCreateBannerComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "banner", templateSlug);

export const useUpdateBannerComponentMutation = (templateSlug: string) => {
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
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        templateSlug,
        { data },
        "banner"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteBannerComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "banner"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useNewsletterComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "newsletter", templateSlug),
  create: useCreateComponentMutation(pageSlug, "newsletter", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "newsletter", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "newsletter", templateSlug),
});

export const useCreateNewsletterComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "newsletter", templateSlug);

export const useUpdateNewsletterComponentMutation = (templateSlug: string) => {
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
        templateSlug,
        { data },
        "newsletter"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteNewsletterComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "newsletter"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useYouTubeComponents = (
  pageSlug: string,
  templateSlug: string
) => ({
  query: useComponentsByTypeQuery(pageSlug, "youtube", templateSlug),
  create: useCreateComponentMutation(pageSlug, "youtube", templateSlug),
  update: useUpdateComponentMutation(pageSlug, "youtube", templateSlug),
  delete: useDeleteComponentMutation(pageSlug, "youtube", templateSlug),
});

export const useCreateYouTubeComponentMutation = (
  pageSlug: string,
  templateSlug: string
) => useCreateComponentMutation(pageSlug, "youtube", templateSlug);

export const useUpdateYouTubeComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
      data,
    }: {
      pageSlug: string;
      componentId: string;
      data: Partial<ComponentTypeMap["youtube"]>;
    }) =>
      componentsApi.updateComponent(
        pageSlug,
        componentId,
        templateSlug,
        { data },
        "youtube"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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

export const useDeleteYouTubeComponentMutation = (templateSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageSlug,
      componentId,
    }: {
      pageSlug: string;
      componentId: string;
    }) =>
      componentsApi.deleteComponent(
        pageSlug,
        componentId,
        templateSlug,
        "youtube"
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", variables.pageSlug, templateSlug],
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
