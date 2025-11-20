"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  useTemplateCategories,
  useTemplateSubcategories,
  useTemplateSearch,
} from "@/hooks/super-admin/components/use-template-category";
import { useDebouncer } from "@/hooks/use-debouncer";

interface OnboardingStepOneProps {
  onContinue: (
    websiteType: string,
    categoryId?: number,
    subcategoryId?: number
  ) => void;
}

export const OnboardingStepOne = ({ onContinue }: OnboardingStepOneProps) => {
  const [websiteType, setWebsiteType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use debouncer for search query with 500ms delay
  const debouncedSearchQuery = useDebouncer(searchQuery, 500);

  // Use search API only with debounced value
  const { data: searchResults, isLoading: searchLoading } = useTemplateSearch(
    debouncedSearchQuery.trim() ? debouncedSearchQuery : ""
  );

  const { data: categories = [], isLoading: categoriesLoading } =
    useTemplateCategories();
  const { data: subcategories = [], isLoading: subcategoriesLoading } =
    useTemplateSubcategories(selectedCategory || undefined);

  // Update search input when category/subcategory is selected
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      if (category) {
        if (selectedSubcategory) {
          const subcategory = subcategories.find(
            sub => sub.id === selectedSubcategory
          );
          if (subcategory) {
            setWebsiteType(`${category.name} - ${subcategory.name}`);
          }
        } else {
          setWebsiteType(category.name);
        }
      }
    }
  }, [selectedCategory, selectedSubcategory, categories, subcategories]);

  const handleContinue = () => {
    if (websiteType.trim() || selectedCategory) {
      onContinue(
        websiteType.trim(),
        selectedCategory || undefined,
        selectedSubcategory || undefined
      );
    }
  };

  const handleSkip = () => {
    onContinue("", undefined, undefined);
  };

  const handleClear = () => {
    setWebsiteType("");
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setShowSubcategories(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (websiteType.trim() || selectedCategory)) {
      handleContinue();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsiteType(value);
    setSearchQuery(value);

    // Clear selections when user starts typing
    if (value && (selectedCategory || selectedSubcategory)) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setShowSubcategories(false);
    }
  };

  const handleCategorySelect = (categoryId: number, categoryName: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setShowSubcategories(true);
    setWebsiteType(categoryName);
    setSearchQuery(""); // Clear search query when selecting from categories
  };

  const handleSubcategorySelect = (
    subcategoryId: number,
    subcategoryName: string
  ) => {
    setSelectedSubcategory(subcategoryId);
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      if (category) {
        setWebsiteType(`${category.name} - ${subcategoryName}`);
      }
    }
    setSearchQuery(""); // Clear search query when selecting from subcategories
  };

  const handleExampleSelect = (example: string) => {
    setWebsiteType(example);
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setShowSubcategories(false);
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      return category?.name;
    }
    return "";
  };

  const getSelectedSubcategoryName = () => {
    if (selectedSubcategory) {
      const subcategory = subcategories.find(
        sub => sub.id === selectedSubcategory
      );
      return subcategory?.name;
    }
    return "";
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6">
        <img src="/fulllogo.svg" />
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-gray-900"
          onClick={handleSkip}
        >
          Skip
        </Button>
      </header>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="h-1 w-full bg-gray-200">
          <div className="h-full w-1/3 bg-blue-600 transition-all duration-300"></div>
        </div>
        <p className="mt-2 text-sm font-medium text-blue-600">Step 1</p>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            What type of website do you want to create?
          </h1>

          {/* Search Input */}
          <div className="mb-8 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for website type or browse categories..."
                value={websiteType}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="h-14 pr-12 pl-12 text-base"
              />
              {websiteType && (
                <button
                  onClick={handleClear}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              onClick={handleContinue}
              disabled={!websiteType.trim() && !selectedCategory}
              className="h-14 bg-blue-600 px-8 text-base font-medium hover:bg-blue-700"
            >
              Continue
            </Button>
          </div>

          {/* Search Results from API - Now using debounced search */}
          {debouncedSearchQuery && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium text-gray-600">
                Search Results for &apos;{debouncedSearchQuery}&apos;:
              </p>

              {searchLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 animate-pulse rounded-md bg-gray-200"
                    ></div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Categories Results from API */}
                  {searchResults?.categories &&
                    searchResults.categories.length > 0 && (
                      <div className="mb-4">
                        <p className="mb-2 text-sm text-gray-500">
                          Categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {searchResults.categories.map(category => (
                            <button
                              key={category.id}
                              onClick={() =>
                                handleCategorySelect(category.id, category.name)
                              }
                              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Subcategories Results from API */}
                  {searchResults?.subcategories &&
                    searchResults.subcategories.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm text-gray-500">
                          Subcategories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {searchResults.subcategories.map(subcategory => (
                            <button
                              key={subcategory.id}
                              onClick={() =>
                                handleSubcategorySelect(
                                  subcategory.id,
                                  subcategory.name
                                )
                              }
                              className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 transition-colors hover:border-green-300 hover:bg-green-100"
                            >
                              {subcategory.name}
                              <span className="ml-1 text-xs text-green-500">
                                (
                                {
                                  categories.find(
                                    cat => cat.id === subcategory.category
                                  )?.name
                                }
                                )
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* No Results */}
                  {(!searchResults?.categories ||
                    searchResults.categories.length === 0) &&
                    (!searchResults?.subcategories ||
                      searchResults.subcategories.length === 0) && (
                      <p className="text-sm text-gray-500">
                        No results found. Try a different search term.
                      </p>
                    )}
                </>
              )}
            </div>
          )}

          {/* Categories Section - Show when not searching */}
          {!debouncedSearchQuery && (
            <div className="mb-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">
                  Browse Categories:
                </p>
              </div>

              {/* Categories List */}
              <div className="mb-4">
                {categoriesLoading ? (
                  <div className="flex flex-wrap gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 w-32 animate-pulse rounded-md bg-gray-200"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() =>
                          handleCategorySelect(category.id, category.name)
                        }
                        className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                          selectedCategory === category.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Category Display */}
              {selectedCategory && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-600">
                    Selected Category:
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      {getSelectedCategoryName()}
                    </span>
                    {selectedSubcategory && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          {getSelectedSubcategoryName()}
                        </span>
                      </>
                    )}
                    <button
                      onClick={handleClear}
                      className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Subcategories - Auto-show when category is selected */}
              {selectedCategory && showSubcategories && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Subcategories:</p>
                    <button
                      onClick={() => setShowSubcategories(false)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ChevronUp className="h-4 w-4" />
                      Hide
                    </button>
                  </div>
                  {subcategoriesLoading ? (
                    <div className="flex flex-wrap gap-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-24 animate-pulse rounded-md bg-gray-200"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {subcategories.map(subcategory => (
                        <button
                          key={subcategory.id}
                          onClick={() =>
                            handleSubcategorySelect(
                              subcategory.id,
                              subcategory.name
                            )
                          }
                          className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                            selectedSubcategory === subcategory.id
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"
                          }`}
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Examples */}
          <div>
            <p className="mb-4 text-sm text-gray-600">Popular Examples:</p>
            <div className="flex flex-wrap gap-3">
              {[
                "Cleaning Service",
                "Automotive Services",
                "Car Detailing Service",
                "Handmade Jewelry",
                "Beauty Salon",
                "Pet Grooming",
                "E-commerce Store",
                "Online Fashion Store",
                "Restaurant",
                "Fitness Center",
                "Photography Studio",
                "Consulting Services",
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleSelect(example)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
