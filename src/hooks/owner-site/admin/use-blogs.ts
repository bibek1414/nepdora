"use client";

import { blogApi, CreateBlogTag } from "@/services/api/owner-sites/admin/blog";
import {
  BlogPost,
  PaginatedBlogResponse,
  BlogFilters,
  CreateBlogPost,
  UpdateBlogPost,
  BlogTag,
} from "@/types/owner-site/admin/blog";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: BlogFilters) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
  similars: () => [...blogKeys.all, "similar"] as const,
  similar: (slug: string) => [...blogKeys.similars(), slug] as const,
  tags: () => [...blogKeys.all, "tags"] as const,
};

export const useBlogs = (
  filters?: BlogFilters,
  options?: Omit<
    UseQueryOptions<PaginatedBlogResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<PaginatedBlogResponse, Error>({
    queryKey: blogKeys.list(filters || {}),
    queryFn: () => blogApi.getBlogs(filters),
    ...options,
  });
};

export const useBlog = (
  slug: string,
  options?: Omit<UseQueryOptions<BlogPost, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<BlogPost, Error>({
    queryKey: ["blog", slug],
    queryFn: () => blogApi.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    ...options,
  });
};

export function useBlogTags() {
  return useQuery<BlogTag[]>({
    queryKey: blogKeys.tags(),
    queryFn: blogApi.getTags,
    staleTime: 5 * 60 * 1000, // Reduced stale time for more frequent refetching
    gcTime: 10 * 60 * 1000,
  });
}

// New hook for creating tags
export function useCreateBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData: CreateBlogTag) => blogApi.createTag(tagData),
    onSuccess: newTag => {
      // Update the tags query cache with the new tag
      queryClient.setQueryData<BlogTag[]>(blogKeys.tags(), oldTags => {
        return oldTags ? [...oldTags, newTag] : [newTag];
      });

      // Alternatively, you can invalidate to refetch
      // queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
    },
    onError: error => {
      console.error("Error creating tag:", error);
    },
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogData }: { blogData: CreateBlogPost }) =>
      blogApi.create(blogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      blogData,
    }: {
      slug: string;
      blogData: Omit<UpdateBlogPost, "id">;
    }) => blogApi.update(slug, blogData),
    onSuccess: updatedBlog => {
      queryClient.setQueryData(blogKeys.detail(updatedBlog.slug), updatedBlog);
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => blogApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
