"use client";

import { useState } from "react";
import { Search, ShoppingCart, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function POSProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(
    "all"
  );

  const { addToCart } = usePOS();

  const PAGE_SIZE = 24; // Increased page size for better view

  // Fetch categories
  const { data: categoriesData } = useCategories({ page_size: 100 });

  // Fetch subcategories based on selected category
  const { data: subCategoriesData } = useSubCategories({
    category:
      selectedCategoryId !== "all" ? parseInt(selectedCategoryId) : undefined,
    page_size: 100,
  });

  const { data: productsData, isLoading } = useProducts({
    search: searchTerm,
    page: currentPage,
    page_size: PAGE_SIZE,
    category_id:
      selectedCategoryId !== "all" ? parseInt(selectedCategoryId) : undefined,
    sub_category_id:
      selectedSubCategoryId !== "all"
        ? parseInt(selectedSubCategoryId)
        : undefined,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedSubCategoryId("all"); // Reset subcategory when category changes
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategoryId(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategoryId("all");
    setSelectedSubCategoryId("all");
    setCurrentPage(1);
  };

  const totalPages = productsData?.count
    ? Math.ceil(productsData.count / PAGE_SIZE)
    : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Search & Filter Header */}
      <div className="flex flex-col border-b border-gray-100 bg-white p-4">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products by name..."
              className="h-12 border-none bg-gray-50 pl-10 text-base placeholder:text-gray-400 focus:bg-white"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <Button
                variant={selectedCategoryId === "all" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-9 shrink-0 rounded-full px-4 text-xs font-medium",
                  selectedCategoryId === "all" && "bg-primary text-white"
                )}
                onClick={() => handleCategoryChange("all")}
              >
                All Categories
              </Button>
              {categoriesData?.results?.map((category: any) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategoryId === category.id.toString()
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={cn(
                    "h-9 shrink-0 rounded-full px-4 text-xs font-medium transition-all",
                    selectedCategoryId === category.id.toString()
                      ? "bg-primary text-white shadow-sm"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => handleCategoryChange(category.id.toString())}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[180px]">
                <Select
                  value={selectedSubCategoryId}
                  onValueChange={handleSubCategoryChange}
                  disabled={selectedCategoryId === "all"}
                >
                  <SelectTrigger className="h-9 rounded-lg border-gray-200 bg-white px-3 text-xs focus:ring-1">
                    <SelectValue placeholder="Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub-categories</SelectItem>
                    {subCategoriesData?.results?.map((sub: any) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchTerm ||
                selectedCategoryId !== "all" ||
                selectedSubCategoryId !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-2 text-gray-500 hover:text-red-500"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : productsData?.results && productsData.results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {productsData.results.map((product: any) => (
              <Card
                key={product.id}
                className="group hover:border-primary cursor-pointer overflow-hidden border-gray-100 p-0 transition-all hover:shadow-md"
                onClick={() => addToCart(product, 1)}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={
                      product.thumbnail_image || "/fallback/image-not-found.png"
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/5 group-hover:opacity-100">
                    <div className="bg-primary flex h-10 w-10 translate-y-2 transform items-center justify-center rounded-full text-white shadow-lg transition-transform group-hover:translate-y-0">
                      <Plus className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 h-10 text-sm leading-tight font-medium text-gray-800">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-primary text-base font-bold">
                      Rs. {parseFloat(product.price).toLocaleString()}
                    </span>
                    {product.stock <= 5 && (
                      <Badge
                        variant="destructive"
                        className="h-4 px-1.5 py-0 text-[10px]"
                      >
                        {product.stock === 0 ? "Out" : `Low: ${product.stock}`}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingCart className="mb-4 h-16 w-16 opacity-20" />
            <p className="text-lg">No products found</p>
          </div>
        )}
      </ScrollArea>

      {/* Pagination */}
      {productsData?.results && productsData.results.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50">
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
