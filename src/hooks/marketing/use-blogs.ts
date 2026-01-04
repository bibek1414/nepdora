"use client";

import { marketingBlogApi } from "@/services/api/marketing/blog";
import {
  BlogPost,
  PaginatedBlogResponse,
  BlogFilters,
  BlogTag,
  BlogCategory,
} from "@/types/super-admin/blog";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const marketingBlogKeys = {
  all: ["marketing-blogs"] as const,
  lists: () => [...marketingBlogKeys.all, "list"] as const,
  list: (filters: BlogFilters) =>
    [...marketingBlogKeys.lists(), filters] as const,
  details: () => [...marketingBlogKeys.all, "detail"] as const,
  detail: (slug: string) => [...marketingBlogKeys.details(), slug] as const,
  recent: () => [...marketingBlogKeys.all, "recent"] as const,
  tags: () => [...marketingBlogKeys.all, "tags"] as const,
  categories: () => [...marketingBlogKeys.all, "categories"] as const,
};

export const useMarketingBlogs = (
  filters?: BlogFilters,
  options?: Omit<
    UseQueryOptions<PaginatedBlogResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<PaginatedBlogResponse, Error>({
    queryKey: marketingBlogKeys.list(filters || {}),
    queryFn: () => marketingBlogApi.getBlogs(filters),
    ...options,
  });
};

export const useMarketingRecentBlogs = (
  options?: Omit<UseQueryOptions<BlogPost[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<BlogPost[], Error>({
    queryKey: marketingBlogKeys.recent(),
    queryFn: () => marketingBlogApi.getRecentBlogs(),
    ...options,
  });
};

export const useMarketingBlog = (
  slug: string,
  options?: Omit<UseQueryOptions<BlogPost, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<BlogPost, Error>({
    queryKey: marketingBlogKeys.detail(slug),
    queryFn: () => marketingBlogApi.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    ...options,
  });
};

export function useMarketingBlogTags() {
  return useQuery<BlogTag[]>({
    queryKey: marketingBlogKeys.tags(),
    queryFn: marketingBlogApi.getTags,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMarketingBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: marketingBlogKeys.categories(),
    queryFn: marketingBlogApi.getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
