import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  productApi as useProductApi,
  ProductFilterParams,
} from "@/services/api/owner-sites/product";
import { toast } from "sonner";
import {
  CreateProductRequest,
  UpdateProductRequest,
  PaginationParams,
} from "@/types/owner-site/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

// Hook to get filter parameters from URL
export const useProductFilters = (): ProductFilterParams => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const filters: ProductFilterParams = {};

    // Get pagination params
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (page) filters.page = parseInt(page, 10);
    if (limit) filters.limit = parseInt(limit, 10);

    // Get search params
    const search = searchParams.get("search");
    if (search) filters.search = search;

    // Get sorting params
    const sortBy = searchParams.get("sort_by");
    const sortOrder = searchParams.get("sort_order");
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder as "asc" | "desc";

    // Get filter params
    const category = searchParams.get("category");
    const subCategory = searchParams.get("sub_category");
    const categoryId = searchParams.get("category_id");
    const subCategoryId = searchParams.get("sub_category_id");

    if (category) filters.category = category;
    if (subCategory) filters.sub_category = subCategory;
    if (categoryId) filters.category_id = parseInt(categoryId, 10);
    if (subCategoryId) filters.sub_category_id = parseInt(subCategoryId, 10);

    // Get boolean filters
    const isFeatured = searchParams.get("is_featured");
    const isPopular = searchParams.get("is_popular");
    const inStock = searchParams.get("in_stock");

    if (isFeatured) filters.is_featured = isFeatured === "true";
    if (isPopular) filters.is_popular = isPopular === "true";
    if (inStock) filters.in_stock = inStock === "true";

    // Get price range filters
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");

    if (minPrice) filters.min_price = parseFloat(minPrice);
    if (maxPrice) filters.max_price = parseFloat(maxPrice);

    return filters;
  }, [searchParams]);
};

// Updated useProducts hook that reads from URL parameters
export const useProducts = (additionalParams: ProductFilterParams = {}) => {
  const urlFilters = useProductFilters();

  // Merge URL filters with additional parameters, giving priority to additionalParams
  const mergedParams = useMemo(
    () => ({
      ...urlFilters,
      ...additionalParams,
    }),
    [urlFilters, additionalParams]
  );

  return useQuery({
    queryKey: ["products", mergedParams],
    queryFn: () => useProductApi.getProducts(mergedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for products without URL filtering (for admin/management pages)
export const useProductsWithParams = (params: ProductFilterParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => useProductApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => useProductApi.getProduct(slug),
    enabled: !!slug,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) =>
      useProductApi.createProduct(data),
    onSuccess: response => {
      // Invalidate all product queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create product");
      }
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      data,
    }: {
      slug: string;
      data: UpdateProductRequest;
    }) => useProductApi.updateProduct(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate all product queries and specific product
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.slug] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update product");
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => useProductApi.deleteProduct(slug),
    onSuccess: response => {
      // Invalidate all product queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete product");
      }
    },
  });
};

// Utility hook for updating URL with filters
export const useUpdateFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (newFilters: Partial<ProductFilterParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters based on newFilters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Always reset to page 1 when filters change (except when explicitly updating page)
    if (!newFilters.hasOwnProperty("page")) {
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(window.location.pathname, { scroll: false });
  };

  return { updateFilters, clearFilters };
};
