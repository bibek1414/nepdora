"use client";

import { X } from "lucide-react";

interface CategoryLike {
  slug: string;
  name: string;
}

interface AppliedFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  categories: CategoryLike[];

  selectedSubcategory: string;
  setSelectedSubcategory: (slug: string) => void;
  subcategories: CategoryLike[];

  selectedSubsubcategory: string;
  subsubcategories: CategoryLike[];

  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;

  searchQuery: string;
  handleClearSearch: () => void;

  handleClearAll: () => void;

  minPrice: number;
  maxPrice: number;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedSubcategory,
  setSelectedSubcategory,
  subcategories,
  subsubcategories,
  priceRange,
  setPriceRange,
  searchQuery,
  handleClearSearch,
  handleClearAll,
  minPrice,
  maxPrice,
}) => {
  const findName = (slug: string, items: CategoryLike[]) =>
    items.find(item => item.slug === slug)?.name;

  const categoryName = findName(selectedCategory, categories);
  const subcategoryName = findName(selectedSubcategory, subcategories);

  const isPriceDefault =
    priceRange.min === minPrice && priceRange.max === maxPrice;

  const appliedFilters = [
    searchQuery && {
      key: "search",
      label: "Search",
      value: `"${searchQuery}"`,
      onClear: handleClearSearch,
    },
    categoryName && {
      key: "category",
      label: "Category",
      value: categoryName,
      onClear: () => setSelectedCategory("all"),
    },
    subcategoryName && {
      key: "subcategory",
      label: "Subcategory",
      value: subcategoryName,
      onClear: () => setSelectedSubcategory("all"),
    },

    !isPriceDefault && {
      key: "price",
      label: "Price",
      value: `₹${priceRange.min} - ₹${priceRange.max}`,
      onClear: () => setPriceRange({ min: minPrice, max: maxPrice }),
    },
  ].filter(Boolean);

  if (appliedFilters.length === 0) {
    return null;
  }

  return (
    <div className="px-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Applied Filters</h3>
        {appliedFilters.length > 1 && (
          <button
            onClick={handleClearAll}
            className="text-primary text-xs font-medium hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {appliedFilters.map(
          filter =>
            filter && (
              <div
                key={filter.key}
                className="flex items-center gap-1.5 rounded-full border border-gray-500 bg-white py-1 pl-2 text-xs text-gray-500"
              >
                <span className="font-medium">{filter.value}</span>
                <button
                  onClick={filter.onClear}
                  className="p-0.5"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default AppliedFilters;
