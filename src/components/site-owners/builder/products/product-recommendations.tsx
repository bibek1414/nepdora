"use client";

import React from "react";
import { ProductCard4 } from "./products-card/product-card4";
import { Product } from "@/types/owner-site/admin/product";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { useRecentlyViewed } from "@/hooks/customer/use-recently-viewed";

interface ProductRecommendationsProps {
  currentProduct: Product;
  siteUser?: string;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
  siteUser,
}) => {
  const { recentProducts } = useRecentlyViewed();

  // Fetch category products for "Products you may like"
  const categoryId = currentProduct?.category?.id;
  const categorySlug = currentProduct?.category?.slug;

  const { data: categoryProductsResponse } = useProducts(
    categorySlug
      ? { category: categorySlug, page_size: 10 }
      : categoryId
        ? { category_id: categoryId, page_size: 10 }
        : {}
  );

  // Filter out the current product from category products
  const relatedProducts =
    categoryProductsResponse?.results?.filter(
      (p: Product) => p.id !== currentProduct.id
    ) || [];

  // Filter out the current product from recent products
  const recentToDisplay = recentProducts.filter(
    (p: Product) => p.id !== currentProduct.id
  );

  if (!relatedProducts.length && !recentToDisplay.length) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Products You May Like Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 mb-32">
          <div className="mb-20 flex items-center justify-center">
            <h2 className="text-foreground text-2xl font-bold md:text-3xl">
              Products You May Like
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {relatedProducts.slice(0, 5).map((product: Product) => (
              <ProductCard4
                key={`related-${product.id}`}
                product={product}
                siteUser={siteUser}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Products Section */}
      {recentToDisplay.length > 0 && (
        <div className="">
          <div className="mb-20 flex items-center justify-center">
            <h2 className="text-foreground text-2xl font-bold md:text-3xl">
              Recent Products
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recentToDisplay.slice(0, 5).map((product: Product) => (
              <ProductCard4
                key={`recent-${product.id}`}
                product={product}
                siteUser={siteUser}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
