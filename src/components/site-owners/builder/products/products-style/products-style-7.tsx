"use client";
import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard7 } from "../products-card/product-card7";
import { EditableText } from "@/components/ui/editable-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { ProductsComponentData } from "@/types/owner-site/components/products";

interface ProductsStyleProps {
  data: ProductsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ProductsComponentData["data"]>) => void;
  onProductClick?: (productId: number) => void;
}

export const ProductsStyle7: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onProductClick,
}) => {
  const {
    title = "Our Products",
    subtitle,
    categoryId,
    subCategoryId,
  } = data || {};
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    category_id: categoryId,
    sub_category_id: subCategoryId,
  });
  const products = productsData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="py-12 text-center">
          <Skeleton className="mx-auto h-[400px] w-full max-w-7xl rounded-xl" />
        </div>
      )}

      {error && (
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Products</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load products."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 text-center">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-2xl font-bold"
              isEditable={isEditable}
              placeholder="Enter title..."
            />
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="text-muted-foreground"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          </div>

          <div className="relative">
            {isEditable && (
              <div className="absolute inset-0 z-10 bg-transparent" />
            )}
            <ProductCard7
              products={products}
              siteUser={isEditable ? undefined : siteUser}
              title={title}
              subtitle={subtitle}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
              isEditable={isEditable}
            />
          </div>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="bg-muted/50 rounded-lg py-12 text-center">
          <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            No Products Found
          </h3>
          <p className="text-muted-foreground">
            Add some products to your inventory to display them here.
          </p>
        </div>
      )}
    </div>
  );
};
