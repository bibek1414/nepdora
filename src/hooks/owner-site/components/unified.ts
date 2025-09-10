import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { componentsApi } from "@/services/api/owner-sites/components/unified";
import {
  ComponentTypeMap,
  ComponentResponse,
} from "@/types/owner-site/components/components";

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

// Generic hook for creating components
export const useCreateComponentMutation = <T extends keyof ComponentTypeMap>(
  pageSlug: string,
  componentType: T
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ComponentTypeMap[T]) =>
      componentsApi.createComponent(pageSlug, {
        component_type: componentType,
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageComponents", pageSlug] });
      queryClient.invalidateQueries({
        queryKey: ["pageComponents", pageSlug, componentType],
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
export const useHeroComponents = (pageSlug: string) => ({
  query: useComponentsByTypeQuery(pageSlug, "hero"),
  create: useCreateComponentMutation(pageSlug, "hero"),
  update: useUpdateComponentMutation(pageSlug, "hero"),
  delete: useDeleteComponentMutation(pageSlug, "hero"),
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
