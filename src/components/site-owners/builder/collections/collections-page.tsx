"use client";

import React, { useState } from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard4 } from "@/components/site-owners/builder/products/products-card/product-card4";
import ProductFilterSidebar from "@/components/site-owners/builder/products/products-filter/product-filter-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag, Filter } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/site-owners/pagination";
import { useProductFilters } from "@/hooks/owner-site/admin/use-product";

interface CollectionsPageProps {
  title?: string;
  siteUser?: string;
  subtitle?: string;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  siteUser,
  title = "Our Collections",
  subtitle = "Explore our curated collection of premium products",
}) => {
  const productFilters = useProductFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get products with pagination and filters
  const { data, isLoading, error } = useProducts({
    page: currentPage,
    ...productFilters,
  });

  // Extract products from the API response structure
  const products = data?.results || [];
  const pagination = data?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (product: Product) => {
    // Handle product click if needed
    console.log("Product clicked:", product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main Layout: Sidebar + Products */}
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-4 z-10 w-64">
              <ProductFilterSidebar siteUser={siteUser} isEditable={false} />
            </div>
          </div>

          {/* Products Area */}
          <div className="min-w-0 flex-1">
            {/* Mobile Filter Toggle */}
            <div className="mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full justify-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                {isSidebarOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
              <div className="mb-6 lg:hidden">
                <ProductFilterSidebar
                  siteUser={siteUser}
                  className="w-full rounded-lg"
                  isEditable={false}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mx-auto max-w-2xl">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Unable to Load Products</AlertTitle>
                <AlertDescription className="text-base">
                  {error instanceof Error
                    ? error.message
                    : "We're having trouble loading our products. Please try refreshing the page."}
                </AlertDescription>
              </Alert>
            )}

            {/* Products Grid */}
            {!isLoading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map(product => (
                    <ProductCard4
                      key={product.id}
                      product={product}
                      siteUser={siteUser}
                      onClick={() => handleProductClick(product)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!isLoading && !error && products.length === 0 && (
              <div className="rounded-lg bg-white py-16 text-center shadow-sm">
                <ShoppingBag className="mx-auto mb-6 h-20 w-20 text-gray-400" />
                <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                  No Products Found
                </h3>
                <p className="mx-auto max-w-md text-lg text-gray-600">
                  We couldn&apos;t find any products matching your filters. Try
                  adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
