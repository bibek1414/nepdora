"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProductCard6 } from "../products-card/product-card6";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, ShoppingBag, AlertCircle } from "lucide-react";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableText } from "@/components/ui/editable-text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { FeaturedProductsButton } from "../featured-products-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductsStyleProps {
  data: ProductsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ProductsComponentData["data"]>) => void;
  onProductClick?: (productslug: string) => void;
}

export const ProductsStyle6: React.FC<ProductsStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const {
    data: editableData,
    handleTextUpdate,
    setData,
  } = useBuilderLogic(data, onUpdate);

  const {
    title = "Trending Now",
    subtitle = "Discover what everyone's loving right now. These fan-favorites are flying off our shelves.",
    categoryId,
    buttonText = "View All",
    buttonLink = "/products",
    display_type = "grid",
    carousel_style = "style-10",
  } = editableData || {};

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useProducts({
    category_id: categoryId,
    page_size: 4,
    is_popular: true,
  });

  const products = productsData?.results || [];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="space-y-4">
            <EditableText
              value={title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="text-3xl font-bold md:text-4xl"
              isEditable={isEditable}
            />
            <EditableText
              value={subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="p"
              className="text-muted-foreground max-w-md"
              isEditable={isEditable}
              multiline
            />
          </div>
          <div className="flex flex-col items-end gap-6">
            {display_type === "carousel" && carousel_style === "style-5" && (
              <div className="hidden gap-3 md:flex">
                {/* Navigation will be rendered inside the Carousel component below */}
              </div>
            )}
            <EditableLink
              text={buttonText}
              href={buttonLink}
              onChange={(text, href) => {
                const update = { buttonText: text, buttonLink: href };
                setData({ ...editableData, ...update });
                onUpdate?.(update);
              }}
              isEditable={isEditable}
              siteUser={siteUser}
            >
              {buttonText}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform" />
            </EditableLink>
          </div>
        </motion.div>

        {/* Products Grid */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}
        {error && (
          <div className="py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Products</AlertTitle>
              <AlertDescription>
                Failed to load trending products.
              </AlertDescription>
            </Alert>
          </div>
        )}
        {!isLoading && !error && products.length > 0 && (
          display_type === "carousel" ? (
            <div className={`relative ${carousel_style === "style-10" ? "px-12" : ""}`}>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-6">
                  {products.map((product, index) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <ProductCard6
                        product={product}
                        index={index}
                        siteUser={siteUser}
                        isEditable={isEditable}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {carousel_style === "style-10" ? (
                  <>
                    <CarouselPrevious className="hidden md:flex -left-4" />
                    <CarouselNext className="hidden md:flex -right-4" />
                  </>
                ) : (
                  <div className="mt-8 flex justify-end gap-3 md:absolute md:-top-24 md:right-0">
                    <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-gray-100 bg-white" />
                    <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-gray-100 bg-white" />
                  </div>
                )}
              </Carousel>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard6
                  key={product.id}
                  product={product}
                  index={index}
                  siteUser={siteUser}
                  isEditable={isEditable}
                />
              ))}
            </div>
          )
        )}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={ShoppingBag}
            title="No Trending Products"
            description="Showcase your popular products to your customers. Add products from the admin dashboard."
            actionLabel="Add New Products"
            actionLink="/admin/products"
            isEditable={isEditable}
            isEmpty={products.length === 0}
            onRefresh={refetch}
          />
        )}

        <FeaturedProductsButton
          isEditable={isEditable}
          productsCount={products.length}
          data={data}
          onUpdate={onUpdate}
        />
      </div>
    </section>
  );
};

export default ProductsStyle6;
