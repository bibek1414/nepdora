"use client";

import { useState } from "react";
import { Search, ShoppingCart, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { usePOS } from "@/contexts/POSContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function POSProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = usePOS();

  const { data: productsData, isLoading } = useProducts({
    search: searchTerm,
    page_size: 20,
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Search Header */}
      <div className="flex items-center gap-4 border-b border-gray-100 bg-white p-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products by name..."
            className="h-12 border-none bg-gray-50 pl-10 text-base placeholder:text-gray-400 focus:bg-white"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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
          <div className="grid grid-cols-2 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productsData.results.map((product: any) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden border-gray-100 p-0 transition-all hover:border-[#4F46E5] hover:shadow-md"
                onClick={() => addToCart(product, 1)}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.thumbnail_image || "/placeholder-product.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/5 group-hover:opacity-100">
                    <div className="flex h-10 w-10 translate-y-2 transform items-center justify-center rounded-full bg-[#4F46E5] text-white shadow-lg transition-transform group-hover:translate-y-0">
                      <Plus className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 h-10 text-sm leading-tight font-medium text-gray-800">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-[#4F46E5]">
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
    </div>
  );
}
