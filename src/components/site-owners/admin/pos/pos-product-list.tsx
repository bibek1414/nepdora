"use client";

import { useState } from "react";
import { Search, ShoppingCart, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { usePOS } from "@/contexts/POSContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SimplePagination } from "@/components/ui/simple-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function POSProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState<string>("all");
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] =
    useState<string>("all");

  const { addToCart } = usePOS();
  const PAGE_SIZE = 24;

  const { data: categoriesData } = useCategories({ page_size: 100 });

  // Find the selected category's ID for sub-category filtering
  const selectedCategory = categoriesData?.results?.find(
    (c: any) => c.slug === selectedCategorySlug
  );

  const { data: subCategoriesData } = useSubCategories({
    category: selectedCategory?.id,
    page_size: 100,
  });
  const { data: productsData, isLoading } = useProducts({
    search: searchTerm,
    page: currentPage,
    page_size: PAGE_SIZE,
    category: selectedCategorySlug !== "all" ? selectedCategorySlug : undefined,
    sub_category:
      selectedSubCategorySlug !== "all" ? selectedSubCategorySlug : undefined,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategorySlug(value);
    setSelectedSubCategorySlug("all");
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategorySlug(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategorySlug("all");
    setSelectedSubCategorySlug("all");
    setCurrentPage(1);
  };

  const totalPages = productsData?.count
    ? Math.ceil(productsData.count / PAGE_SIZE)
    : 0;

  const hasActiveFilters =
    searchTerm ||
    selectedCategorySlug !== "all" ||
    selectedSubCategorySlug !== "all";

  return (
    <div className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
      {/* Search & Filter Header */}
      <div className="border-border bg-card shrink-0 space-y-3 border-b px-4 py-3">
        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search products…"
            className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-10 pl-9 text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills + Sub-category Select */}
        <div className="flex items-center gap-2">
          {/* Scrollable pill row */}
          <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-xs font-medium transition-all focus:outline-none",
                selectedCategorySlug === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              All
            </button>
            {categoriesData?.results?.map((category: any) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={cn(
                  "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-xs font-medium transition-all focus:outline-none",
                  selectedCategorySlug === category.slug
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sub-category */}
          <div className="shrink-0">
            <Select
              value={selectedSubCategorySlug}
              onValueChange={handleSubCategoryChange}
              disabled={selectedCategorySlug === "all"}
            >
              <SelectTrigger className="border-border bg-muted/40 h-7 w-[160px] rounded-full px-3 text-xs focus:ring-1">
                <SelectValue placeholder="Sub-category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sub-categories</SelectItem>
                {subCategoriesData?.results?.map((sub: any) => (
                  <SelectItem key={sub.id} value={sub.slug}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-muted-foreground hover:text-destructive flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-full px-2.5 text-xs transition-colors focus:outline-none"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="border-border bg-muted overflow-hidden rounded-xl border"
                >
                  <div className="bg-muted aspect-square animate-pulse" />
                  <div className="space-y-2 p-3">
                    <div className="bg-muted-foreground/20 h-3 w-3/4 animate-pulse rounded" />
                    <div className="bg-muted-foreground/10 h-3 w-1/2 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsData?.results && productsData.results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 pb-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {productsData.results.map((product: any) => (
                <button
                  key={product.id}
                  className="group border-border bg-card hover:border-primary/60 focus:ring-ring cursor-pointer overflow-hidden rounded-xl border text-left transition-all hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  onClick={() => addToCart(product, 1)}
                >
                  {/* Image */}
                  <div className="bg-muted relative aspect-square overflow-hidden">
                    <Image
                      unoptimized
                      src={
                        product.thumbnail_image ||
                        "/fallback/image-not-found.png"
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Add overlay */}
                    <div className="bg-foreground/0 group-hover:bg-foreground/10 absolute inset-0 flex items-center justify-center transition-all duration-200">
                      <div className="bg-primary text-primary-foreground flex h-9 w-9 translate-y-2 items-center justify-center rounded-full opacity-0 shadow-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Low stock badge */}
                    {product.stock <= 5 && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            product.stock === 0 ? "destructive" : "outline"
                          }
                          className={cn(
                            "h-5 px-1.5 text-[9px] font-semibold",
                            product.stock > 0 &&
                              "border-amber-200 bg-amber-50 text-amber-700"
                          )}
                        >
                          {product.stock === 0
                            ? "Out of stock"
                            : `${product.stock} left`}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <p className="text-foreground line-clamp-2 min-h-10 text-xs leading-relaxed font-medium">
                      {product.name}
                    </p>
                    <p className="text-primary mt-1 text-sm font-bold">
                      Rs. {parseFloat(product.price).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground flex h-64 flex-col items-center justify-center">
              <ShoppingCart className="mb-3 h-12 w-12 opacity-20" />
              <p className="text-sm font-medium">No products found</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary mt-2 cursor-pointer text-xs underline underline-offset-2 hover:no-underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Pagination */}
      {productsData?.results &&
        productsData.results.length > 0 &&
        totalPages > 1 && (
          <div className="border-border bg-muted/30 shrink-0 border-t">
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
    </div>
  );
}
