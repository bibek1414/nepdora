import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, X } from "lucide-react";
import {
  useSearchProducts,
  useSuggestedProducts,
} from "@/hooks/owner-site/admin/use-search-products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Image from "next/image";
import { Product } from "@/types/owner-site/admin/product";

interface SearchResults {
  results: Product[];
}

// Search Bar Component
interface SearchBarProps {
  siteUser: string;
  isEditable?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  siteUser,
  isEditable = false,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Theme integration
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

  // Helper function to create gradient with opacity variations
  const createGradientStyle = () => {
    const primaryColor = theme.colors.primary;
    return {
      background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}33, ${primaryColor}0D)`,
    };
  };

  // Truncate text function
  const truncateText = (text: string, maxLength: number = 30): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Generate product URL
  const getProductUrl = (product: Product): string => {
    return `/preview/${siteUser}/products-draft/${product.slug}`;
  };

  // Handle product click navigation
  const handleProductClick = (product: Product): void => {
    closeSearchResults();
    const productUrl = getProductUrl(product);
    window.location.href = productUrl;
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use the product search hooks
  const { data: searchResults, isLoading: isSearchLoading } = useSearchProducts(
    debouncedSearchQuery,
    {
      enabled: debouncedSearchQuery.length > 0 && !isEditable,
    }
  );

  const { data: suggestedProducts, isLoading: isSuggestionsLoading } =
    useSuggestedProducts({
      enabled: isSearchFocused && searchQuery.length === 0 && !isEditable,
    });

  // Memoize products to avoid dependency issues
  const products = useMemo(() => {
    if (searchQuery.length > 0) {
      return (searchResults as SearchResults)?.results || [];
    }
    return (suggestedProducts as SearchResults)?.results || [];
  }, [searchQuery, searchResults, suggestedProducts]);

  const isLoading =
    searchQuery.length > 0 ? isSearchLoading : isSuggestionsLoading;

  // Sort products for suggestions
  const sortedProducts = useMemo(() => {
    if (!products.length) return [];

    if (searchQuery.length === 0) {
      return [...products].sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        if (a.is_popular && !b.is_popular) return -1;
        if (!a.is_popular && b.is_popular) return 1;
        return 0;
      });
    }

    return products;
  }, [products, searchQuery]);

  // Handle dropdown visibility
  useEffect(() => {
    if (isEditable) {
      setShowDropdown(false);
      return;
    }

    if (isSearchFocused) {
      if (searchQuery.length === 0) {
        setShowDropdown(true);
      } else if (debouncedSearchQuery.length > 0) {
        const shouldShow =
          isLoading ||
          sortedProducts.length > 0 ||
          (!isLoading && sortedProducts.length === 0);
        setShowDropdown(shouldShow);
      }
    } else {
      setShowDropdown(false);
    }
  }, [
    isSearchFocused,
    searchQuery,
    debouncedSearchQuery,
    isLoading,
    sortedProducts.length,
    isEditable,
  ]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim() && !isEditable) {
      setShowDropdown(false);
      setIsSearchFocused(false);
      // Navigate to products page with search
      window.location.href = `/preview/${siteUser}/collections?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSearchKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") {
      // Create a synthetic form event to submit
      const formEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      }) as unknown as React.FormEvent<HTMLFormElement>;
      handleSearchSubmit(formEvent);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setIsSearchFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFocus = (): void => {
    if (!isEditable) {
      setIsSearchFocused(true);
    }
  };

  const handleClearSearch = (): void => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const closeSearchResults = (): void => {
    setShowDropdown(false);
    setIsSearchFocused(false);
  };

  const handleViewAllResults = (): void => {
    closeSearchResults();
    window.location.href = `/preview/${siteUser}/collections?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  const page_sizeedProducts = sortedProducts.slice(0, 5);
  const showSuggestions =
    searchQuery.length === 0 && isSearchFocused && !isEditable;
  const showSearchResults =
    searchQuery.length > 0 && debouncedSearchQuery.length > 0 && !isEditable;

  return (
    <div ref={searchRef} className={`relative w-full max-w-md ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div
          className="relative rounded-xl p-[1px]"
          style={createGradientStyle()}
        >
          <div className="relative rounded-xl bg-white">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={
                isEditable ? "Search (preview only)" : "Search products..."
              }
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyPress}
              onFocus={handleSearchFocus}
              disabled={isEditable}
              className={`h-11 w-full rounded-xl border-0 bg-transparent pr-10 pl-10 text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                isEditable ? "cursor-not-allowed opacity-60" : ""
              }`}
              style={{
                fontFamily: theme.fonts.body,
              }}
            />
            {searchQuery && !isEditable && (
              <Button
                type="button"
                onClick={handleClearSearch}
                variant="ghost"
                size="sm"
                className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>

      {showDropdown && !isEditable && (
        <Card className="absolute right-0 left-0 z-[9999] mt-2 min-w-[320px] border-2">
          <CardContent className="p-0">
            <ScrollArea className="max-h-[500px]">
              <div className="p-4">
                {showSuggestions && (
                  <>
                    <div className="mb-2">
                      <span
                        className="text-sm font-medium"
                        style={{
                          fontFamily: theme.fonts.heading,
                        }}
                      >
                        Suggested Products
                      </span>
                    </div>

                    {isSuggestionsLoading ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
                        <div
                          className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                          style={{
                            borderColor: theme.colors.primary + "33",
                            borderTopColor: "transparent",
                          }}
                        ></div>
                        <span className="text-sm">Loading suggestions…</span>
                      </div>
                    ) : page_sizeedProducts.length > 0 ? (
                      <div className="space-y-2">
                        {page_sizeedProducts.map((product: Product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-gray-50"
                          >
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {product.thumbnail_image && (
                                <Image
                                  src={product.thumbnail_image}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="text-sm font-medium"
                                title={product.name}
                                style={{
                                  fontFamily: theme.fonts.body,
                                }}
                              >
                                {truncateText(product.name, 45)}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <span
                                  className="text-sm font-bold"
                                  style={{
                                    color: theme.colors.primary,
                                    fontFamily: theme.fonts.heading,
                                  }}
                                >
                                  ₹{product.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Search className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                        <div className="text-sm text-gray-500">
                          No suggested products available
                        </div>
                      </div>
                    )}
                  </>
                )}

                {showSearchResults && (
                  <>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">
                        Search results for{" "}
                        <span
                          className="font-medium"
                          style={{
                            fontFamily: theme.fonts.heading,
                          }}
                        >
                          &ldquo;{debouncedSearchQuery}&rdquo;
                        </span>
                      </span>
                    </div>

                    {isSearchLoading ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
                        <div
                          className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                          style={{
                            borderColor: theme.colors.primary + "33",
                            borderTopColor: "transparent",
                          }}
                        ></div>
                        <span className="text-sm">Searching…</span>
                      </div>
                    ) : (
                      <>
                        {page_sizeedProducts.length > 0 ? (
                          <div className="mb-2">
                            <div className="mb-3 flex items-center gap-2">
                              <Search
                                className="h-4 w-4"
                                style={{ color: theme.colors.primary }}
                              />
                              <span
                                className="text-sm font-semibold"
                                style={{
                                  fontFamily: theme.fonts.heading,
                                }}
                              >
                                Products
                              </span>
                            </div>
                            <div className="space-y-3">
                              {page_sizeedProducts.map((product: Product) => (
                                <div
                                  key={product.id}
                                  onClick={() => handleProductClick(product)}
                                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-gray-50"
                                >
                                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                    {product.thumbnail_image && (
                                      <Image
                                        src={product.thumbnail_image}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className="text-sm font-medium"
                                      title={product.name}
                                      style={{
                                        fontFamily: theme.fonts.body,
                                      }}
                                    >
                                      {truncateText(product.name, 45)}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                      <span
                                        className="text-sm font-bold"
                                        style={{
                                          color: theme.colors.primary,
                                          fontFamily: theme.fonts.heading,
                                        }}
                                      >
                                        ₹{product.price}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <Search className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                            <div className="mb-2 text-sm text-gray-500">
                              No results found for &ldquo;{debouncedSearchQuery}
                              &rdquo;
                            </div>
                            <div className="mb-3 text-xs text-gray-400">
                              Try searching with different keywords
                            </div>
                          </div>
                        )}

                        {sortedProducts.length > 5 && (
                          <>
                            <Separator className="my-3" />
                            <div
                              onClick={handleViewAllResults}
                              className="block w-full cursor-pointer py-2 text-center text-sm font-medium transition-colors"
                              style={{
                                color: theme.colors.primary,
                                fontFamily: theme.fonts.heading,
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.opacity = "0.8";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              View all results for &ldquo;{searchQuery}&rdquo;
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
