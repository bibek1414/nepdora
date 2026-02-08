"use client";

import {
  Search,
  X,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Category, SubCategory } from "@/types/owner-site/admin/product";

interface PriceRange {
  min: number;
  max: number;
}

interface SortOption {
  value: string;
  label: string;
}

interface MobileFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (value: string) => void;
  selectedSubsubcategory: string;
  setSelectedSubsubcategory: (value: string) => void;
  priceRange: PriceRange;
  setPriceRange: (value: PriceRange) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  categories: Category[];
  subcategories: SubCategory[];
  sortOptions: SortOption[];
  handleClearAll: () => void;
  handleClearSearch: () => void;
  isFiltering?: boolean;
}

export default function MobileFilterPanel({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSubsubcategory,
  setSelectedSubsubcategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  categories,
  subcategories,
  sortOptions,
  handleClearAll,
  handleClearSearch,
  isFiltering = false,
}: MobileFilterPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([selectedCategory])
  );

  const toggleCategoryExpansion = (categorySlug: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categorySlug)) {
      newExpanded.delete(categorySlug);
    } else {
      newExpanded.add(categorySlug);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categorySlug: string) => {
    if (categorySlug === selectedCategory) {
      toggleCategoryExpansion(categorySlug);
    } else {
      setSelectedCategory(categorySlug);
      if (categorySlug !== "all") {
        setExpandedCategories(new Set([categorySlug]));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="bg-opacity-50 absolute inset-0 bg-black"
        onClick={onClose}
      />
      <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Search</h3>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 py-2 pr-4 pl-8 text-sm focus:ring-2"
                />
                <Search className="absolute top-3 left-2.5 h-4 w-4 text-gray-400" />
                {isFiltering && (
                  <Loader2 className="text-primary absolute top-3.5 right-2.5 h-3 w-3 animate-spin" />
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedCategory === "all" ? "from-primary to-primary bg-linear-to-r text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <div key={category.slug}>
                    <button
                      onClick={() => handleCategoryClick(category.slug)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedCategory === category.slug ? "from-primary to-primary bg-linear-to-r text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                    >
                      <span>{category.name}</span>
                      {selectedCategory === category.slug &&
                        subcategories.length > 0 &&
                        (expandedCategories.has(category.slug) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        ))}
                    </button>
                    {selectedCategory === category.slug &&
                      expandedCategories.has(category.slug) &&
                      subcategories.length > 0 && (
                        <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                          {subcategories.map(subcategory => (
                            <div key={subcategory.slug}>
                              <button
                                onClick={() =>
                                  setSelectedSubcategory(subcategory.slug)
                                }
                                className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${selectedSubcategory === subcategory.slug ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}
                              >
                                {subcategory.name}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Price Range
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    value={priceRange.min}
                    onChange={e =>
                      setPriceRange({
                        ...priceRange,
                        min: Number(e.target.value),
                      })
                    }
                    className="focus:ring-primary focus:border-primary w-1/2 rounded-lg border border-gray-300 p-2 text-sm focus:ring-2"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    value={priceRange.max}
                    onChange={e =>
                      setPriceRange({
                        ...priceRange,
                        max: Number(e.target.value),
                      })
                    }
                    className="focus:ring-primary focus:border-primary w-1/2 rounded-lg border border-gray-300 p-2 text-sm focus:ring-2"
                    placeholder="Max"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Rs. {priceRange.min.toLocaleString("en-IN")}</span>
                  <span>Rs. {priceRange.max.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto border-t p-4">
            <button
              onClick={handleClearAll}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200"
            >
              <RotateCcw className="h-4 w-4" /> Clear All Filters
            </button>
            {isFiltering && (
              <div className="text-primary flex items-center justify-center gap-2 pt-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Updating results...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
