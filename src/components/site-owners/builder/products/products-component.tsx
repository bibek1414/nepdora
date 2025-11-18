import React, { useState } from "react";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { ProductCard1 } from "./product-card1";
import { ProductCard2 } from "./product-card2";
import { ProductCard3 } from "./product-card3";
import { ProductCard4 } from "./product-card4";
import { ProductCard5 } from "./product-card5";
import { ProductCard6 } from "./product-card6";
import { ProductCard7 } from "./product-card7";
import ProductFilterSidebar from "./products-filter/product-filter-sidebar";
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
import { AlertCircle, Trash2, ShoppingBag, Filter } from "lucide-react";
import { Product } from "@/types/owner-site/admin/product";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import Pagination from "@/components/ui/site-owners/pagination";
import { useProductFilters } from "@/hooks/owner-site/admin/use-product";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductsComponentProps {
  component: ProductsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ProductsComponentData) => void;
  onProductClick?: (productId: number, order: number) => void;
  showSidebar?: boolean;
}

export const ProductsComponent: React.FC<ProductsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onProductClick,
  showSidebar = true,
}) => {
  const productFilters = useProductFilters();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    page_size = 8,
    title = "Our Products",
    subtitle,
    style = "grid-1",
    showPrice = true,
    showDescription = true,
    showStock = true,
    itemsPerRow = 4,
  } = component.data || {};

  // Determine if we should show sidebar based on style
  const shouldShowSidebar = showSidebar && style === "product-4";
  const isCarouselStyle = style === "product-1" || style === "product-6";
  const isFullSectionStyle = style === "product-7";
  const currentFilters = shouldShowSidebar && !isEditable ? productFilters : {};

  // Use unified mutation hooks
  const deleteProductsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "products"
  );
  const updateProductsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "products"
  );

  // Get products with pagination and conditionally apply filters
  const { data, isLoading, error } = useProducts({
    page: currentPage,
    page_size: page_size,
    ...(shouldShowSidebar && !isEditable ? currentFilters : {}),
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

    updateProductsComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        title: newTitle,
      },
    });

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

    updateProductsComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        subtitle: newSubtitle,
      },
    });

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
      case "product-2":
        return <ProductCard2 key={product.id} {...cardProps} />;
      case "product-3":
        return <ProductCard3 key={product.id} {...cardProps} />;
      case "product-1":
        return <ProductCard1 key={product.id} {...cardProps} />;
      case "product-6":
        return <ProductCard6 key={product.id} {...cardProps} />;
      case "product-4":
        return <ProductCard4 key={product.id} {...cardProps} />;
      case "product-5":
        return <ProductCard5 key={product.id} {...cardProps} />;
      case "product-7":
        return <ProductCard7 key={product.id} {...cardProps} />;
      case "grid-1":
      default:
        return <ProductCard1 key={product.id} {...cardProps} />;
    }
  };

  const getGridClass = () => {
    switch (style) {
      case "product-2":
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(itemsPerRow, 3)}`;
      case "product-3":
        return "grid-cols-1 lg:grid-cols-2 gap-8";
      case "product-7":
        return "";
      case "product-1":
      case "product-6":
        return "";
      case "product-4":
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(itemsPerRow, 4)}`;
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
        <div className="absolute -right-5 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex items-center gap-2">
              <Link
                href="/admin/products"
                target="_blank"
                onClick={e => e.stopPropagation()}
                className="z-30"
              >
                <Button variant="outline" size="sm">
                  Manage Products
                </Button>
              </Link>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="z-30 h-8 px-3"
                  disabled={deleteProductsComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteProductsComponent.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
            </div>
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

        {/* Products Preview with Conditional Sidebar Layout */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* Header - Hide for product-7 as it has its own header */}
            {!isFullSectionStyle && (
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
            )}

            <div className={shouldShowSidebar ? "relative flex gap-6" : ""}>
              {/* Sidebar - Only show for ProductCard4 (product-4) */}
              {shouldShowSidebar && (
                <div className="hidden lg:block">
                  <ProductFilterSidebar
                    siteUser={siteUser}
                    isEditable={isEditable}
                  />
                </div>
              )}

              {/* Products Area */}
              <div className="flex-1">
                {/* Mobile Sidebar Toggle - Only for ProductCard4 */}
                {shouldShowSidebar && (
                  <div className="mb-4 lg:hidden">
                    <Button
                      variant="outline"
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="w-full"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {isSidebarOpen ? "Hide Filters" : "Show Filters"}
                    </Button>
                  </div>
                )}

                {/* Mobile Sidebar - Only for ProductCard4 */}
                {shouldShowSidebar && isSidebarOpen && (
                  <div className="mb-6 lg:hidden">
                    <ProductFilterSidebar
                      siteUser={siteUser}
                      className="w-full"
                      isEditable={isEditable}
                    />
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div
                    className={
                      isCarouselStyle || isFullSectionStyle
                        ? ""
                        : `grid ${getGridClass()} gap-6`
                    }
                  >
                    {Array.from({ length: Math.min(page_size, 8) }).map(
                      (_, index) => (
                        <div key={index} className="flex flex-col space-y-3">
                          <Skeleton className="h-[250px] w-full rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-1/3" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Error State */}
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

                {/* Products Grid/Carousel */}
                {!isLoading && !error && products.length > 0 && (
                  <>
                    {isFullSectionStyle ? (
                      // ProductCard7 is a complete section, render it once with all products
                      <ProductCard7
                        products={products}
                        siteUser={isEditable ? undefined : siteUser}
                        title={title}
                        subtitle={subtitle}
                      />
                    ) : isCarouselStyle ? (
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full"
                      >
                        <CarouselContent className="-ml-4">
                          {products.map((product, index) => (
                            <CarouselItem
                              key={product.id}
                              className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                              <div className="relative">
                                {/* Overlay to prevent clicks in builder mode */}
                                <div className="absolute inset-0 z-10 bg-transparent" />
                                {renderProductCard(product, index)}
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0" />
                        <CarouselNext className="right-0" />
                      </Carousel>
                    ) : (
                      <div className={`grid ${getGridClass()} gap-6`}>
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
                    )}

                    {/* Pagination - Hide for carousel and full section styles */}
                    {!isCarouselStyle &&
                      !isFullSectionStyle &&
                      pagination &&
                      pagination.totalPages > 1 && (
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

                {/* Empty State */}
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
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header - Hide for product-7 as it has its own header */}
        {!isFullSectionStyle && (
          <div className="mb-12 text-center">
            <h2
              className="text-foreground mb-4 text-4xl font-bold tracking-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            ></h2>
            {subtitle && (
              <p
                className="text-muted-foreground mx-auto max-w-3xl text-xl"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              ></p>
            )}
          </div>
        )}

        {/* Conditional Layout: Sidebar + Products OR Just Products */}
        <div className={shouldShowSidebar ? "flex gap-8" : ""}>
          {/* Sidebar - Desktop - Only show for ProductCard4 */}
          {shouldShowSidebar && (
            <div className="hidden flex-shrink-0 lg:block">
              <ProductFilterSidebar
                siteUser={siteUser}
                isEditable={isEditable}
              />
            </div>
          )}

          {/* Products Area */}
          <div className="z-10 min-w-0 flex-1">
            {/* Mobile Filter Toggle - Only for ProductCard4 */}
            {shouldShowSidebar && (
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
            )}

            {/* Mobile Sidebar - Only for ProductCard4 */}
            {shouldShowSidebar && isSidebarOpen && (
              <div className="mb-8 lg:hidden">
                <ProductFilterSidebar
                  siteUser={siteUser}
                  className="w-full rounded-lg"
                  isEditable={isEditable}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div
                className={
                  isCarouselStyle || isFullSectionStyle
                    ? ""
                    : `grid ${getGridClass()} gap-8`
                }
              >
                {Array.from({ length: page_size }).map((_, index) => (
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

            {/* Products Grid/Carousel */}
            {!isLoading && !error && products.length > 0 && (
              <>
                {isFullSectionStyle ? (
                  <ProductCard7
                    products={products}
                    siteUser={siteUser}
                    title={title}
                    subtitle={subtitle}
                  />
                ) : isCarouselStyle ? (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {products.map((product, index) => (
                        <CarouselItem
                          key={product.id}
                          className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                          {renderProductCard(product, index)}
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                  </Carousel>
                ) : (
                  <div className={`grid ${getGridClass()} gap-8`}>
                    {products.map((product, index) => (
                      <div key={product.id} className="flex-shrink-0">
                        {renderProductCard(product, index)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination - Hide for carousel and full section styles */}
                {!isCarouselStyle &&
                  !isFullSectionStyle &&
                  pagination &&
                  pagination.totalPages > 1 && (
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
        </div>
      </div>
    </section>
  );
};
