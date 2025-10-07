"use client";

import {
  portfolioApi,
  CreatePortfolioTag,
  CreatePortfolioCategory,
} from "@/services/api/owner-sites/admin/portfolio";
import {
  Portfolio,
  PaginatedPortfolioResponse,
  PortfolioFilters,
  CreatePortfolio,
  UpdatePortfolio,
  PortfolioTag,
  PortfolioCategory,
} from "@/types/owner-site/admin/portfolio";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export const portfolioKeys = {
  all: ["portfolios"] as const,
  lists: () => [...portfolioKeys.all, "list"] as const,
  list: (filters: PortfolioFilters) =>
    [...portfolioKeys.lists(), filters] as const,
  details: () => [...portfolioKeys.all, "detail"] as const,
  detail: (slug: string) => [...portfolioKeys.details(), slug] as const,
  tags: () => [...portfolioKeys.all, "tags"] as const,
  categories: () => [...portfolioKeys.all, "categories"] as const,
};

export const usePortfolios = (
  filters?: PortfolioFilters,
  options?: Omit<
    UseQueryOptions<PaginatedPortfolioResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<PaginatedPortfolioResponse, Error>({
    queryKey: portfolioKeys.list(filters || {}),
    queryFn: () => portfolioApi.getPortfolios(filters),
    ...options,
  });
};

export const usePortfolio = (
  slug: string,
  options?: Omit<UseQueryOptions<Portfolio, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Portfolio, Error>({
    queryKey: ["portfolio", slug],
    queryFn: () => portfolioApi.getPortfolioBySlug(slug),
    enabled: !!slug,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    ...options,
  });
};

export function usePortfolioTags() {
  return useQuery<PortfolioTag[]>({
    queryKey: portfolioKeys.tags(),
    queryFn: portfolioApi.getTags,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePortfolioCategories() {
  return useQuery<PortfolioCategory[]>({
    queryKey: portfolioKeys.categories(),
    queryFn: portfolioApi.getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePortfolioTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData: CreatePortfolioTag) =>
      portfolioApi.createTag(tagData),
    onSuccess: newTag => {
      queryClient.setQueryData<PortfolioTag[]>(
        portfolioKeys.tags(),
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

export function useCreatePortfolioCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CreatePortfolioCategory) =>
      portfolioApi.createCategory(categoryData),
    onSuccess: newCategory => {
      queryClient.setQueryData<PortfolioCategory[]>(
        portfolioKeys.categories(),
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

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ portfolioData }: { portfolioData: CreatePortfolio }) =>
      portfolioApi.create(portfolioData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      portfolioData,
    }: {
      slug: string;
      portfolioData: Omit<UpdatePortfolio, "id">;
    }) => portfolioApi.update(slug, portfolioData),
    onSuccess: updatedPortfolio => {
      queryClient.setQueryData(
        portfolioKeys.detail(updatedPortfolio.slug),
        updatedPortfolio
      );
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => portfolioApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}
