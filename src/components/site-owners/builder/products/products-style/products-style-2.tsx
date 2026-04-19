"use client";
import React from "react";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { ProductCard7 } from "../products-card/product-card7";
import { EditableText } from "@/components/ui/editable-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface ProductsStyleProps {
  data: ProductsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ProductsComponentData["data"]>) => void;
  onProductClick?: (productslug: string) => void;
}

export const ProductsStyle2: React.FC<ProductsStyleProps> = ({
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
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  };
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
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
              className="mb-4 text-center text-2xl font-bold"
              style={{ fontFamily: theme.fonts.heading }}
              isEditable={isEditable}
              placeholder="Enter title..."
            />
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="text-muted-foreground mx-auto max-w-3xl text-center"
              style={{ fontFamily: theme.fonts.body }}
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

      {!isLoading && !error && (
        <BuilderEmptyState
          icon={ShoppingBag}
          title="No Products Found"
          description="Showcase your products to your customers. Add products from the admin dashboard."
          actionLabel="Add New Products"
          actionLink="/admin/product"
          isEditable={isEditable}
          isEmpty={products.length === 0}
          onRefresh={refetch}
        />
      )}
    </div>
  );
};
