"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useProducts } from "./use-product";
import { useCategories } from "./use-category";
import { useSubCategory } from "./use-subcategory";

const PAGE_SIZE = 9;

interface PriceRange {
  min: number;
  max: number;
}

interface SortOption {
  value: string;
  label: string;
}

const sortMapping: { [key: string]: string } = {
  featured: "-is_featured",
  "price-low": "price",
  "price-high": "-price",
  "name-asc": "name",
  "name-desc": "-name",
};

export const useProductsFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedSubsubcategory, setSelectedSubsubcategory] =
    useState<string>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 100000,
  });
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const { data: subcategoriesData = [], isLoading: loadingSubcategories } =
    useSubCategory(selectedCategory !== "all" ? selectedCategory : undefined);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const newSearchQuery = params.get("search") || "";
    setCurrentPage(Number(params.get("page")) || 1);
    setSelectedCategory(params.get("category") || "all");
    setSelectedSubcategory(params.get("subcategory") || "all");
    setSelectedSubsubcategory(params.get("subsubcategory") || "all");
    setSortBy(params.get("sort") || "featured");
    setSearchQuery(newSearchQuery);
    setDebouncedSearchQuery(newSearchQuery);
    setPriceRange({
      min: Number(params.get("min_price")) || 0,
      max: Number(params.get("max_price")) || 100000,
    });
    isMounted.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!isMounted.current) return;
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery !== (searchParams.get("search") || "")) {
        setCurrentPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchParams]);

  useEffect(() => {
    if (!isMounted.current) return;
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedSubcategory !== "all")
      params.set("subcategory", selectedSubcategory);
    if (selectedSubsubcategory !== "all")
      params.set("subsubcategory", selectedSubsubcategory);
    if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (priceRange.min > 0) params.set("min_price", String(priceRange.min));
    if (priceRange.max < 100000)
      params.set("max_price", String(priceRange.max));
    if (currentPage > 1) params.set("page", String(currentPage));

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedSubsubcategory,
    debouncedSearchQuery,
    sortBy,
    priceRange,
    currentPage,
    pathname,
    router,
  ]);

  const currentFilters = useMemo(
    () => ({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      subsubcategory: selectedSubsubcategory,
      min_price: priceRange.min,
      max_price: priceRange.max,
      ordering: sortMapping[sortBy] || sortMapping["featured"],
      search: debouncedSearchQuery,
      page: currentPage,
      page_size: PAGE_SIZE,
    }),
    [
      selectedCategory,
      selectedSubcategory,
      selectedSubsubcategory,
      priceRange,
      sortBy,
      debouncedSearchQuery,
      currentPage,
    ]
  );

  const {
    data: productsResponse = { results: [], count: 0 },
    isLoading,
    isFetching,
    isError,
  } = useProducts(currentFilters);
  const products = productsResponse.results || [];
  const totalCount = productsResponse.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCategoryChange = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory("all");
    setSelectedSubsubcategory("all");
    setCurrentPage(1);
  }, []);

  const handleSubcategoryChange = useCallback((subcategorySlug: string) => {
    setSelectedSubcategory(subcategorySlug);
    setSelectedSubsubcategory("all");
    setCurrentPage(1);
  }, []);

  const handleSubsubcategoryChange = useCallback(
    (subsubcategorySlug: string) => {
      setSelectedSubsubcategory(subsubcategorySlug);
      setCurrentPage(1);
    },
    []
  );

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  }, []);

  const handlePriceRangeChange = useCallback((newPriceRange: PriceRange) => {
    setPriceRange(newPriceRange);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedSubsubcategory("all");
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("featured");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const sortOptions: SortOption[] = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  return {
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    selectedSubcategory,
    setSelectedSubcategory: handleSubcategoryChange,
    selectedSubsubcategory,
    setSelectedSubsubcategory: handleSubsubcategoryChange,
    priceRange,
    setPriceRange: handlePriceRangeChange,
    sortBy,
    setSortBy: handleSortChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    categories,
    subcategories: subcategoriesData,
    products,
    sortOptions,
    loading:
      isLoading || isFetching || loadingCategories || loadingSubcategories,
    error: isError,
    isFiltering: isFetching && !isLoading,
    handleClearAll,
    handleClearSearch,
    currentPage,
    totalPages,
    handlePageChange,
  };
};
