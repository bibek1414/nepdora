import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTemplateCategoryApi } from "@/services/api/super-admin/components/template-category";
import {
  CreateTemplateCategoryRequest,
  CreateTemplateSubcategoryRequest,
} from "@/types/super-admin/components/template-category";

export const useTemplateCategories = (search?: string) => {
  return useQuery({
    queryKey: ["template-categories", search],
    queryFn: () => useTemplateCategoryApi.getCategories(search),
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

export const useTemplateSubcategories = (
  categoryId?: number,
  search?: string
) => {
  return useQuery({
    queryKey: ["template-subcategories", categoryId, search],
    queryFn: () =>
      categoryId
        ? useTemplateCategoryApi.getSubcategoriesByCategory(categoryId, search)
        : useTemplateCategoryApi.getSubcategories(search),
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

// Search across both categories and subcategories
export const useTemplateSearch = (search: string) => {
  const categoriesQuery = useTemplateCategories(search);
  const subcategoriesQuery = useTemplateSubcategories(undefined, search);

  return {
    data: {
      categories: categoriesQuery.data || [],
      subcategories: subcategoriesQuery.data || [],
    },
    isLoading: categoriesQuery.isLoading || subcategoriesQuery.isLoading,
    error: categoriesQuery.error || subcategoriesQuery.error,
  };
};
