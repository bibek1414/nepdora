"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types/owner-site/admin/product";
import { useProductsWithParams } from "@/hooks/owner-site/admin/use-product";
import { useUpdateProduct } from "@/hooks/owner-site/admin/use-product";
import { Search, Check, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const ProductCard = ({
  product,
  isActive,
  isPending,
  activeTab,
  onToggle,
}: {
  product: Product;
  isActive: boolean;
  isPending: boolean;
  activeTab: "featured" | "popular";
  onToggle: (productId: number, isCurrentlyActive: boolean) => void;
}) => (
  <div
    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
      isPending
        ? activeTab === "featured"
          ? isActive
            ? "border-red-200 bg-red-50"
            : "border-amber-200 bg-amber-50"
          : isActive
            ? "border-red-200 bg-red-50"
            : "border-blue-200 bg-blue-50"
        : isActive
          ? activeTab === "featured"
            ? "border-amber-200 bg-amber-50"
            : "border-blue-200 bg-blue-50"
          : "cursor-pointer border-gray-200 bg-white hover:border-gray-300"
    }`}
    onClick={() => onToggle(product.id, isActive)}
  >
    <Checkbox
      checked={
        isActive && !isPending
          ? true
          : isPending
            ? isActive
              ? false
              : true
            : false
      }
      onCheckedChange={() => onToggle(product.id, isActive)}
      onClick={e => e.stopPropagation()}
      className="shrink-0"
    />
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
      {product.thumbnail_image ? (
        <Image
          src={product.thumbnail_image}
          alt={product.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
          No img
        </div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{product.name}</p>
      <p className="text-xs text-gray-500">Rs.{product.price}</p>
    </div>
    {isActive && !isPending && (
      <Badge
        variant="secondary"
        className={
          activeTab === "featured"
            ? "r bg-amber-100 text-amber-700"
            : "r bg-blue-100 text-blue-700"
        }
      >
        {activeTab === "featured" ? <>Featured</> : <>Popular</>}
      </Badge>
    )}
  </div>
);

interface ManageFeaturedProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageFeaturedProductsDialog: React.FC<
  ManageFeaturedProductsDialogProps
> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<"featured" | "popular">(
    "featured"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [removedProducts, setRemovedProducts] = useState<Set<number>>(
    new Set()
  );

  // Fetch all products
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useProductsWithParams({
    page_size: 100,
    search: searchQuery || undefined,
  });

  const products = productsData?.results || [];

  // Filter products based on current tab
  const featuredProducts = products.filter(p => p.is_featured);
  const popularProducts = products.filter(p => p.is_popular);
  const nonFeaturedProducts = products.filter(p => !p.is_featured);
  const nonPopularProducts = products.filter(p => !p.is_popular);

  const updateProductMutation = useUpdateProduct();
  const queryClient = useQueryClient();

  // Reset selections when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedProducts(new Set());
      setRemovedProducts(new Set());
    }
  }, [open, activeTab]);

  const handleToggleProduct = (
    productId: number,
    isCurrentlyActive: boolean
  ) => {
    if (isCurrentlyActive) {
      // Mark for removal
      setRemovedProducts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });
    } else {
      // Mark for addition
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });
    }
  };

  const handleSave = async () => {
    const productsToUpdate: {
      product: Product;
      isFeatured: boolean;
      isPopular: boolean;
    }[] = [];

    if (activeTab === "featured") {
      // Products to add as featured
      selectedProducts.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          productsToUpdate.push({
            product,
            isFeatured: true,
            isPopular: product.is_popular || false,
          });
        }
      });
      // Products to remove from featured
      removedProducts.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          productsToUpdate.push({
            product,
            isFeatured: false,
            isPopular: product.is_popular || false,
          });
        }
      });
    } else {
      // Products to add as popular
      selectedProducts.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          productsToUpdate.push({
            product,
            isFeatured: product.is_featured || false,
            isPopular: true,
          });
        }
      });
      // Products to remove from popular
      removedProducts.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          productsToUpdate.push({
            product,
            isFeatured: product.is_featured || false,
            isPopular: false,
          });
        }
      });
    }

    if (productsToUpdate.length === 0) {
      onOpenChange(false);
      return;
    }

    const toastId = toast.loading(
      `Updating ${productsToUpdate.length} products...`
    );

    try {
      // Update products sequentially
      for (const { product, isFeatured, isPopular } of productsToUpdate) {
        if (!product.slug) continue;
        await updateProductMutation.mutateAsync({
          slug: product.slug,
          data: {
            is_featured: isFeatured,
            is_popular: isPopular,
          },
          skipInvalidate: true,
        });
      }

      toast.success(
        `Successfully updated ${productsToUpdate.length} products!`,
        { id: toastId }
      );

      // Invalidate once at the end instead of per-product.
      // QueryClient.invalidateQueries will automatically trigger refetch for active queries.
      queryClient.invalidateQueries({ queryKey: ["products"] });

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update some products", { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] scale-85 flex-col gap-0 overflow-hidden p-0 sm:max-w-[800px]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Manage Featured & Best Selling Products</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={v => setActiveTab(v as "featured" | "popular")}
          className="flex min-h-0 flex-1 flex-col px-6 py-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="featured" className="cursor-pointer gap-2">
              Featured
              {featuredProducts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {featuredProducts.length -
                    (activeTab === "featured" ? removedProducts.size : 0) +
                    (activeTab === "featured" ? selectedProducts.size : 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="popular" className="cursor-pointer gap-2">
              Best Selling
              {popularProducts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {popularProducts.length -
                    (activeTab === "popular" ? removedProducts.size : 0) +
                    (activeTab === "popular" ? selectedProducts.size : 0)}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="relative mt-4">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 placeholder:text-slate-400"
            />
          </div>

          <TabsContent
            value="featured"
            className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm font-medium">
                Featured Products (
                {featuredProducts.length -
                  removedProducts.size +
                  selectedProducts.size}
                )
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProducts(new Set())}
                disabled={
                  selectedProducts.size === 0 && removedProducts.size === 0
                }
              >
                Clear Changes
              </Button>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {/* Currently Featured */}
                  {featuredProducts.length > 0 && (
                    <div className="space-y-2">
                      <p className="-wide sticky top-0 z-10 bg-white py-2 text-xs font-semibold text-gray-500">
                        Currently Featured
                      </p>
                      {featuredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isActive={true}
                          isPending={removedProducts.has(product.id)}
                          activeTab={activeTab}
                          onToggle={handleToggleProduct}
                        />
                      ))}
                    </div>
                  )}

                  {/* Available to Add */}
                  <div className="mt-4 space-y-2">
                    <p className="-wide sticky top-0 z-10 bg-white py-2 text-xs font-semibold text-gray-500">
                      Available Products
                    </p>
                    {nonFeaturedProducts.length === 0 ? (
                      <p className="py-4 text-center text-sm text-gray-500">
                        All products are already featured
                      </p>
                    ) : (
                      nonFeaturedProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isActive={false}
                          isPending={selectedProducts.has(product.id)}
                          activeTab={activeTab}
                          onToggle={handleToggleProduct}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="popular"
            className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm font-medium">
                Best Selling Products (
                {popularProducts.length -
                  removedProducts.size +
                  selectedProducts.size}
                )
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProducts(new Set());
                  setRemovedProducts(new Set());
                }}
                disabled={
                  selectedProducts.size === 0 && removedProducts.size === 0
                }
              >
                Clear Changes
              </Button>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {/* Currently Popular */}
                  {popularProducts.length > 0 && (
                    <div className="space-y-2">
                      <p className="-wide sticky top-0 z-10 bg-white py-2 text-xs font-semibold text-gray-500">
                        Currently Best Selling
                      </p>
                      {popularProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isActive={true}
                          isPending={removedProducts.has(product.id)}
                          activeTab={activeTab}
                          onToggle={handleToggleProduct}
                        />
                      ))}
                    </div>
                  )}

                  {/* Available to Add */}
                  <div className="mt-4 space-y-2">
                    <p className="-wide sticky top-0 z-10 bg-white py-2 text-xs font-semibold text-gray-500">
                      Available Products
                    </p>
                    {nonPopularProducts.length === 0 ? (
                      <p className="py-4 text-center text-sm text-gray-500">
                        All products are already marked as best selling
                      </p>
                    ) : (
                      nonPopularProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isActive={false}
                          isPending={selectedProducts.has(product.id)}
                          activeTab={activeTab}
                          onToggle={handleToggleProduct}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t bg-gray-50/50 p-6 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedProducts.size === 0 && removedProducts.size === 0}
          >
            Save Changes
            {selectedProducts.size + removedProducts.size > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedProducts.size + removedProducts.size}
              </Badge>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
