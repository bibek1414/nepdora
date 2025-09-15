import React, { useState } from "react";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useProducts } from "@/hooks/owner-site/use-product";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";
import { ProductCard1 } from "./product-card1";
import { ProductCard2 } from "./product-card2";
import { ProductCard3 } from "./product-card3";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, ShoppingBag } from "lucide-react";
import { Product } from "@/types/owner-site/product";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import Pagination from "@/components/ui/pagination";

interface ProductsComponentProps {
  component: ProductsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ProductsComponentData) => void;
  onProductClick?: (productId: number, order: number) => void;
}

export const ProductsComponent: React.FC<ProductsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onProductClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    limit = 8,
    title = "Our Products",
    subtitle,
    style = "grid-1",
    showPrice = true,
    showDescription = true,
    showStock = true,
    itemsPerRow = 4,
  } = component.data || {};

  // Use unified mutation hooks
  const deleteProductsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "products"
  );
  const updateProductsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "products"
  );

  // Get products with pagination
  const { data, isLoading, error } = useProducts({
    page: currentPage,
    limit: limit,
  });

  // Extract products from the API response structure
  const products = data?.results || [];
  const pagination = data?.pagination;

  const handleProductClick = (product: Product) => {
    if (onProductClick && component.order !== undefined) {
      onProductClick(product.id, component.order);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }

    deleteProductsComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    // Update component data via unified API
    updateProductsComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        title: newTitle,
      },
    });

    // Also update local state if onUpdate is provided
    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    // Update component data via unified API
    updateProductsComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        subtitle: newSubtitle,
      },
    });

    // Also update local state if onUpdate is provided
    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderProductCard = (product: Product, index: number) => {
    const cardProps = {
      product,
      siteUser: isEditable ? undefined : siteUser,
      showPrice,
      showDescription,
      showStock,
      onClick: () => handleProductClick(product),
    };

    switch (style) {
      case "grid-2":
        return <ProductCard2 key={product.id} {...cardProps} />;
      case "list-1":
        return <ProductCard3 key={product.id} {...cardProps} />;
      case "carousel-1":
        return <ProductCard1 key={product.id} {...cardProps} />;
      case "grid-1":
      default:
        return <ProductCard1 key={product.id} {...cardProps} />;
    }
  };

  const getGridClass = () => {
    switch (style) {
      case "grid-2":
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(itemsPerRow, 3)}`;
      case "list-1":
        return "grid-cols-1 lg:grid-cols-2 gap-8";
      case "carousel-1":
        return "flex overflow-x-auto gap-6 pb-4";
      case "grid-1":
      default:
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(itemsPerRow, 4)}`;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleDeleteClick}
                variant="destructive"
                size="sm"
                className="h-8 px-3"
                disabled={deleteProductsComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteProductsComponent.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Products Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this products component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteProductsComponent.isPending}
                >
                  {deleteProductsComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Products Preview */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <EditableText
                value={title}
                onChange={handleTitleChange}
                as="h2"
                className="text-foreground mb-2 text-3xl font-bold tracking-tight"
                isEditable={true}
                placeholder="Enter title..."
              />
              <EditableText
                value={subtitle || ""}
                onChange={handleSubtitleChange}
                as="p"
                className="text-muted-foreground mx-auto max-w-2xl text-lg"
                isEditable={true}
                placeholder="Enter subtitle..."
                multiline={true}
              />
            </div>

            {isLoading && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {Array.from({ length: Math.min(limit, 8) }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Products</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load products. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && products.length > 0 && (
              <>
                <div
                  className={`${style === "carousel-1" ? "flex gap-6 overflow-x-auto pb-4" : `grid ${getGridClass()} gap-6`}`}
                >
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                    >
                      {/* Overlay to prevent clicks in builder mode */}
                      <div className="absolute inset-0 z-10 bg-transparent" />
                      {renderProductCard(product, index)}
                    </div>
                  ))}
                </div>

                {/* Pagination for builder mode */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
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
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              {subtitle}
            </p>
          )}
        </div>

        {isLoading && (
          <div
            className={`${style === "carousel-1" ? "flex gap-6 overflow-x-auto pb-4" : `grid ${getGridClass()} gap-8`}`}
          >
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

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

        {!isLoading && !error && products.length > 0 && (
          <>
            <div
              className={`${style === "carousel-1" ? "flex gap-8 overflow-x-auto pb-4" : `grid ${getGridClass()} gap-8`}`}
            >
              {products.map((product, index) => (
                <div key={product.id} className="flex-shrink-0">
                  {renderProductCard(product, index)}
                </div>
              ))}
            </div>

            {/* Pagination for live site */}
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

        {!isLoading && !error && products.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingBag className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Products Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We&apos;re currently updating our inventory. Please check back
              soon for new products.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
