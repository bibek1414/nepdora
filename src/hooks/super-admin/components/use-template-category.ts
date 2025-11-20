import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTemplateCategoryApi } from "@/services/api/super-admin/components/template-category";
import {
  CreateTemplateCategoryRequest,
  CreateTemplateSubcategoryRequest,
} from "@/types/super-admin/components/template-category";

export const useTemplateCategories = () => {
  return useQuery({
    queryKey: ["template-categories"],
    queryFn: () => useTemplateCategoryApi.getCategories(),
  });
};

export const useTemplateCategory = (slug: string) => {
  return useQuery({
    queryKey: ["template-category", slug],
    queryFn: () => useTemplateCategoryApi.getCategory(slug),
    enabled: !!slug,
  });
};

export const useCreateTemplateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTemplateCategoryRequest) =>
      useTemplateCategoryApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-categories"] });
    },
  });
};

export const useTemplateSubcategories = (categoryId?: number) => {
  return useQuery({
    queryKey: ["template-subcategories", categoryId],
    queryFn: () =>
      categoryId
        ? useTemplateCategoryApi.getSubcategoriesByCategory(categoryId)
        : useTemplateCategoryApi.getSubcategories(),
  });
};

export const useTemplateSubcategory = (slug: string) => {
  return useQuery({
    queryKey: ["template-subcategory", slug],
    queryFn: () => useTemplateCategoryApi.getSubcategory(slug),
    enabled: !!slug,
  });
};

export const useCreateTemplateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTemplateSubcategoryRequest) =>
      useTemplateCategoryApi.createSubcategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-subcategories"] });
    },
  });
};
