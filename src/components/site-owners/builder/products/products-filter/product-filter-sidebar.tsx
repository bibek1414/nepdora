import React, { useState, useRef, useEffect } from "react";
import { X, Search, ChevronRight, RotateCcw, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { useDebouncer } from "@/hooks/use-debouncer";
import { useRouter } from "next/navigation";
import { useProductFilters } from "@/hooks/owner-site/admin/use-product";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import PriceRangeSlider from "./price-range-slider";
import AppliedFilters from "./applied-filters";

interface PriceRange {
  min: number;
  max: number;
}

interface ProductFilterSidebarProps {
  siteUser?: string;
  className?: string;
  isEditable?: boolean;
}

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  siteUser,
  className = "",
  isEditable = false,
}) => {
  const productFilters = useProductFilters();

  // Theme hook
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 100000,
  });

  // Hover states for navigation
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(
    null
  );
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const minPrice = 0;
  const maxPrice = 100000;

  // Use debouncer for search query
  const debouncedSearchQuery = useDebouncer(searchQuery, 1000);

  // Get current filters from URL only if not in editable mode
  const currentFilters = !isEditable ? productFilters : {};

  // Fetch categories and subcategories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: subCategoriesData, isLoading: subCategoriesLoading } =
    useSubCategories();

  const categories = categoriesData?.results || [];
  const subCategories = subCategoriesData?.results || [];

  // Navigate to products page with filters - only if not in editable mode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigateToProducts = (filters: Record<string, any>) => {
    if (isEditable) {
      return;
    }

    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value.toString());
      }
    });

    const productsUrl = siteUser
      ? `/preview/${siteUser}/products-draft?${searchParams.toString()}`
      : `/products?${searchParams.toString()}`;

    router.push(productsUrl);
  };

  // Helper functions
  const findCategoryName = (slug: string) =>
    categories.find(cat => cat.slug === slug)?.name;

  const findSubcategoryName = (slug: string) => {
    return subCategories.find(sub => sub.slug === slug)?.name;
  };

  const getSubCategoriesForCategory = (categoryId: number) => {
    return subCategories.filter(subCat => {
      if (typeof subCat.category === "object" && subCat.category) {
        return subCat.category.id === categoryId;
      }
      return parseInt(subCat.category as string) === categoryId;
    });
  };

  const getSubcategoriesByCategorySlug = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) return [];
    return getSubCategoriesForCategory(category.id);
  };

  // Handle debounced search - automatically navigate when search changes
  useEffect(() => {
    if (isEditable) return;

    if (debouncedSearchQuery.trim()) {
      navigateToProducts({
        search: debouncedSearchQuery,
        ...currentFilters,
        page: 1,
      });
    } else if (searchQuery === "" && currentFilters.search) {
      const { search, ...otherFilters } = currentFilters;
      navigateToProducts(otherFilters);
    }
  }, [debouncedSearchQuery, isEditable]);

  // Sync URL filters to local state
  useEffect(() => {
    if (isEditable) return;

    if (
      currentFilters.category &&
      currentFilters.category !== selectedCategory
    ) {
      setSelectedCategory(currentFilters.category);
    }
    if (
      currentFilters.sub_category &&
      currentFilters.sub_category !== selectedSubcategory
    ) {
      setSelectedSubcategory(currentFilters.sub_category);
    }
    if (currentFilters.search && currentFilters.search !== searchQuery) {
      setSearchQuery(currentFilters.search);
    }
    if (currentFilters.min_price || currentFilters.max_price) {
      const min = currentFilters.min_price || minPrice;
      const max = currentFilters.max_price || maxPrice;
      if (min !== priceRange.min || max !== priceRange.max) {
        setPriceRange({ min, max });
      }
    }
  }, [currentFilters, isEditable]);

  // Hover handlers
  const handleMouseEnter = (categorySlug: string) => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    setHoveredCategory(categorySlug);
    setHoveredSubcategory(null);
  };

  const handleSubcategoryMouseEnter = (subcategorySlug: string) => {
    setHoveredSubcategory(subcategorySlug);
  };

  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setHoveredCategory(null);
      setHoveredSubcategory(null);
    }, 200);
  };

  // Selection handlers
  const handleSelectCategory = (categorySlug: string) => {
    if (isEditable) return;

    setSelectedCategory(categorySlug);
    setSelectedSubcategory("all");
    setHoveredCategory(null);

    if (categorySlug === "all") {
      navigateToProducts({ page: 1 });
    } else {
      navigateToProducts({
        category: categorySlug,
        page: 1,
      });
    }
  };

  const handleSelectSubcategory = (
    subcategorySlug: string,
    categorySlug: string
  ) => {
    if (isEditable) return;

    setSelectedCategory(categorySlug);
    setSelectedSubcategory(subcategorySlug);
    setHoveredCategory(null);
    setHoveredSubcategory(null);

    navigateToProducts({
      category: categorySlug,
      sub_category: subcategorySlug,
      page: 1,
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSearchQuery("");
    setPriceRange({ min: minPrice, max: maxPrice });
    setHoveredCategory(null);
    setHoveredSubcategory(null);

    if (!isEditable) {
      const productsUrl = siteUser
        ? `/preview/${siteUser}/products`
        : `/products`;
      router.push(productsUrl);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    if (!isEditable) {
      const { search, ...otherFilters } = currentFilters;
      navigateToProducts(otherFilters);
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (newRange: PriceRange) => {
    setPriceRange(newRange);

    if (!isEditable) {
      navigateToProducts({
        ...currentFilters,
        min_price: newRange.min,
        max_price: newRange.max,
        page: 1,
      });
    }
  };

  // Loading state
  if (categoriesLoading || subCategoriesLoading) {
    return (
      <div
        className={`w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      >
        <div className="p-6">
          <div className="animate-pulse">
            <div className="mb-4 h-6 rounded bg-gray-200"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render skeleton for loading subcategories
  const renderSkeleton = (count = 5) => (
    <div className="py-1">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="px-3 py-1.5">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`w-65 rounded-xl bg-white ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {/* Applied Filters */}
      <AppliedFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        subcategories={subCategories}
        selectedSubsubcategory="all"
        subsubcategories={[]}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        handleClearAll={handleClearAll}
        minPrice={minPrice}
        maxPrice={maxPrice}
        searchQuery={searchQuery}
        handleClearSearch={handleClearSearch}
      />

      {/* Search */}
      <div className="border-b border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
            }}
            className="w-full rounded-lg border border-gray-200 py-2.5 pr-4 pl-10 text-sm placeholder-gray-500 focus:border-transparent focus:ring-2 focus:outline-none"
            style={
              {
                "--tw-ring-color": theme.colors.primary,
              } as React.CSSProperties
            }
            disabled={isEditable}
          />
        </div>
      </div>

      {/* Categories with Hover Navigation */}
      <div className="border-b border-gray-100 p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">Categories</h2>
        <div className="space-y-1">
          {/* All Categories */}
          <button
            onClick={() => handleSelectCategory("all")}
            className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
              selectedCategory === "all"
                ? "text-white"
                : "text-gray-700 hover:bg-orange-50"
            }`}
            style={
              {
                backgroundColor:
                  selectedCategory === "all"
                    ? `${theme.colors.primary}E6`
                    : undefined,
                color:
                  selectedCategory === "all"
                    ? theme.colors.primaryForeground
                    : undefined,
                "--hover-color":
                  selectedCategory !== "all"
                    ? `${theme.colors.primary}E6`
                    : undefined,
              } as React.CSSProperties
            }
            onMouseEnter={e => {
              if (selectedCategory !== "all") {
                (e.target as HTMLElement).style.color =
                  `${theme.colors.primary}E6`;
              }
            }}
            onMouseLeave={e => {
              if (selectedCategory !== "all") {
                (e.target as HTMLElement).style.color = "";
              }
            }}
            disabled={isEditable}
          >
            All Categories
          </button>

          {/* Individual Categories with Hover Dropdowns */}
          {categories.map(category => {
            const subcategories = getSubCategoriesForCategory(category.id);
            const isSelected = selectedCategory === category.slug;

            return (
              <div key={category.slug} className="relative">
                <button
                  onMouseEnter={() => handleMouseEnter(category.slug)}
                  onClick={() => handleSelectCategory(category.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                    isSelected
                      ? "font-medium shadow-sm"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? `${theme.colors.primary}E6`
                      : undefined,
                    color: isSelected
                      ? theme.colors.primaryForeground
                      : undefined,
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      (e.target as HTMLElement).style.color = "";
                    }
                  }}
                  disabled={isEditable}
                >
                  <span>{category.name}</span>
                  {subcategories.length > 0 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {/* Subcategories Dropdown */}
                {hoveredCategory === category.slug &&
                  subcategories.length > 0 && (
                    <div
                      className="absolute top-0 left-full z-50 ml-1 w-60 rounded-lg bg-white shadow-lg ring-1 ring-gray-200"
                      onMouseEnter={() => handleMouseEnter(category.slug)}
                    >
                      <div className="py-1">
                        {subcategories.map(subcategory => (
                          <div key={subcategory.slug} className="relative">
                            <button
                              onMouseEnter={() =>
                                handleSubcategoryMouseEnter(subcategory.slug)
                              }
                              onClick={() =>
                                handleSelectSubcategory(
                                  subcategory.slug,
                                  category.slug
                                )
                              }
                              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                                selectedSubcategory === subcategory.slug
                                  ? "font-semibold"
                                  : "text-gray-600"
                              }`}
                              style={{
                                color:
                                  selectedSubcategory === subcategory.slug
                                    ? theme.colors.primary
                                    : undefined,
                              }}
                              disabled={isEditable}
                            >
                              <span>{subcategory.name}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="mb-4 text-sm font-bold text-gray-800">Price</h3>
          <PriceRangeSlider
            value={priceRange}
            onChange={handlePriceRangeChange}
            min={minPrice}
            max={maxPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
