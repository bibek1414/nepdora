"use client";

import {
  superAdminBlogApi,
  CreateBlogTag,
} from "@/services/api/super-admin/blog";
import {
  BlogPost,
  PaginatedBlogResponse,
  BlogFilters,
  CreateBlogPost,
  UpdateBlogPost,
  BlogTag,
  BlogCategory,
} from "@/types/super-admin/blog";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export const superAdminBlogKeys = {
  all: ["super-admin-blogs"] as const,
  lists: () => [...superAdminBlogKeys.all, "list"] as const,
  list: (filters: BlogFilters) =>
    [...superAdminBlogKeys.lists(), filters] as const,
  details: () => [...superAdminBlogKeys.all, "detail"] as const,
  detail: (slug: string) => [...superAdminBlogKeys.details(), slug] as const,
  recent: () => [...superAdminBlogKeys.all, "recent"] as const,
  tags: () => [...superAdminBlogKeys.all, "tags"] as const,
  categories: () => [...superAdminBlogKeys.all, "categories"] as const,
};

export const useSuperAdminBlogs = (
  filters?: BlogFilters,
  options?: Omit<
    UseQueryOptions<PaginatedBlogResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<PaginatedBlogResponse, Error>({
    queryKey: superAdminBlogKeys.list(filters || {}),
    queryFn: () => superAdminBlogApi.getBlogs(filters),
    ...options,
  });
};

export const useSuperAdminRecentBlogs = (
  options?: Omit<UseQueryOptions<BlogPost[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<BlogPost[], Error>({
    queryKey: superAdminBlogKeys.recent(),
    queryFn: () => superAdminBlogApi.getRecentBlogs(),
    ...options,
  });
};

export const useSuperAdminBlog = (
  slug: string,
  options?: Omit<UseQueryOptions<BlogPost, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<BlogPost, Error>({
    queryKey: superAdminBlogKeys.detail(slug),
    queryFn: () => superAdminBlogApi.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    ...options,
  });
};

export function useSuperAdminBlogTags() {
  return useQuery<BlogTag[]>({
    queryKey: superAdminBlogKeys.tags(),
    queryFn: superAdminBlogApi.getTags,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSuperAdminBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: superAdminBlogKeys.categories(),
    queryFn: superAdminBlogApi.getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateSuperAdminBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData: CreateBlogTag) =>
      superAdminBlogApi.createTag(tagData),
    onSuccess: newTag => {
      queryClient.setQueryData<BlogTag[]>(
        superAdminBlogKeys.tags(),
        oldTags => {
          return oldTags ? [...oldTags, newTag] : [newTag];
        }
      );
    },
    onError: error => {
      console.error("Error creating tag:", error);
    },
  });
}

export function useCreateSuperAdminBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: { name: string }) =>
      superAdminBlogApi.createCategory(categoryData),
    onSuccess: newCategory => {
      queryClient.setQueryData<BlogCategory[]>(
        superAdminBlogKeys.categories(),
        oldCategories => {
          return oldCategories
            ? [...oldCategories, newCategory]
            : [newCategory];
        }
      );
    },
    onError: error => {
      console.error("Error creating category:", error);
    },
  });
}

export function useUpdateSuperAdminBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, name }: { slug: string; name: string }) =>
      superAdminBlogApi.updateCategory(slug, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: superAdminBlogKeys.categories(),
      });
    },
  });
}

export function useDeleteSuperAdminBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => superAdminBlogApi.deleteCategory(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: superAdminBlogKeys.categories(),
      });
    },
  });
}

export function useUpdateSuperAdminBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, name }: { slug: string; name: string }) =>
      superAdminBlogApi.updateTag(slug, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminBlogKeys.tags() });
    },
  });
}

export function useDeleteSuperAdminBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => superAdminBlogApi.deleteTag(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminBlogKeys.tags() });
    },
  });
}

export function useCreateSuperAdminBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogData }: { blogData: CreateBlogPost }) =>
      superAdminBlogApi.create(blogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminBlogKeys.lists() });
    },
  });
}

export function useUpdateSuperAdminBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      blogData,
    }: {
      slug: string;
      blogData: Omit<UpdateBlogPost, "id">;
    }) => superAdminBlogApi.update(slug, blogData),
    onSuccess: updatedBlog => {
      queryClient.setQueryData(
        superAdminBlogKeys.detail(updatedBlog.slug),
        updatedBlog
      );
      queryClient.invalidateQueries({ queryKey: superAdminBlogKeys.lists() });
    },
  });
}

export function useDeleteSuperAdminBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => superAdminBlogApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminBlogKeys.all });
    },
  });
}
