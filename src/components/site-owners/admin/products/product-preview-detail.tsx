"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

type PreviewImage = string | File | null | undefined;

// Minimal product shape needed by the preview UI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PreviewProductData extends Record<string, any> {
  id?: string | number;
  name: string;
  description?: string;
  price?: string;
  market_price?: string | null;
  stock?: number;
  thumbnail_image?: PreviewImage;
  thumbnail_alt_description?: string;
  images?: Array<{ image: PreviewImage } | string>;
  category?: {
    id?: number | string;
    name: string;
    slug?: string;
    description?: string;
  } | null;
  sub_category?: {
    id?: number | string;
    name: string;
    slug?: string;
    description?: string;
  } | null;
  is_featured?: boolean;
  is_popular?: boolean;
  variants_read?: Array<{
    id?: string | number;
    option_values: Record<string, string>;
    price?: string;
    stock?: number;
    image?: PreviewImage;
  }>;
  options?: Array<{
    id?: string | number;
    name: string;
    values: Array<{ id?: string | number; value: string } | string>;
  }>;
  average_rating?: number;
  reviews_count?: number;
}

interface ProductPreviewDetailProps {
  product: PreviewProductData;
  siteUser?: string;
}

export const ProductPreviewDetail: React.FC<ProductPreviewDetailProps> = ({
  product,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const [quantity, setQuantity] = React.useState(1);
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string>
  >({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVariant, setSelectedVariant] = React.useState<any>(null);

  const fileToUrl = React.useCallback((img: PreviewImage): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    try {
      return URL.createObjectURL(img);
    } catch {
      return null;
    }
  }, []);

  const productImages: string[] = React.useMemo(() => {
    const list: string[] = [];
    const thumb =
      fileToUrl(product.thumbnail_image) ||
      (typeof product.thumbnail_image === "string"
        ? product.thumbnail_image
        : null);
    if (thumb) list.push(thumb);
    const extras = (product.images || [])
      .map(img => {
        if (typeof img === "string") return img;
        // object with image field
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (img as any).image as PreviewImage;
        return fileToUrl(val) || undefined;
      })
      .filter(Boolean) as string[];
    return [...list, ...extras].filter(Boolean);
  }, [product.images, product.thumbnail_image, fileToUrl]);

  React.useEffect(() => {
    if (!selectedImage) {
      setSelectedImage(productImages[0] || defaultImage);
    }
  }, [productImages, selectedImage]);

  React.useEffect(() => {
    if (product?.options && product.options.length > 0) {
      const initial: Record<string, string> = {};
      product.options.forEach(opt => {
        const values = opt.values || [];
        const first =
          typeof values[0] === "string"
            ? values[0]
            : (values[0] as { value: string })?.value;
        if (first) initial[opt.name] = first;
      });
      setSelectedOptions(initial);
    }
  }, [product?.options]);

  React.useEffect(() => {
    if (product?.variants_read && Object.keys(selectedOptions).length > 0) {
      const matching = product.variants_read.find(variant => {
        return Object.entries(selectedOptions).every(
          ([name, val]) => variant.option_values[name] === val
        );
      });
      setSelectedVariant(matching || null);
      if (matching?.image) {
        const url = fileToUrl(matching.image);
        if (url) setSelectedImage(url);
      } else if (productImages[0]) {
        setSelectedImage(productImages[0]);
      }
    }
  }, [selectedOptions, product?.variants_read, productImages, fileToUrl]);

  const getCurrentPrice = () => {
    if (selectedVariant?.price) return parseFloat(selectedVariant.price);
    return parseFloat(product?.price || "0");
  };

  const getCurrentStock = () => {
    if (
      selectedVariant?.stock !== null &&
      selectedVariant?.stock !== undefined
    ) {
      return selectedVariant.stock;
    }
    return product?.stock || 0;
  };

  const isOptionValueAvailable = (optionName: string, value: string) => {
    if (!product?.variants_read) return true;
    const test = { ...selectedOptions, [optionName]: value };
    return product.variants_read.some(variant => {
      const matches = Object.entries(test).every(
        ([name, val]) => variant.option_values[name] === val
      );
      return matches && (variant.stock ?? 0) > 0;
    });
  };

  const price = getCurrentPrice();
  const marketPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;
  const discountPercentage =
    marketPrice && marketPrice > price
      ? Math.round(((marketPrice - price) / marketPrice) * 100)
      : 0;
  const discountedPrice = price.toFixed(2);
  const currentStock = getCurrentStock();
  const rating = product.average_rating || 0;
  const reviewsCount = product.reviews_count || 0;

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
    borderColor: theme.colors.primary,
  };
  const outlineButtonStyle: React.CSSProperties = {
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  };

  return (
    <div className="bg-background pt-5 pb-80">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          <div>
            <div className="border-border relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={selectedImage || defaultImage}
                alt={product.thumbnail_alt_description || product.name}
                fill
                className="object-contain"
                onError={e => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {(productImages.length
                ? productImages.slice(0, 5)
                : [defaultImage]
              ).map((img, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="relative aspect-square overflow-hidden p-0"
                  style={
                    selectedImage === img
                      ? { outline: `2px solid ${theme.colors.primary}` }
                      : undefined
                  }
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              {product.category?.name && (
                <Badge
                  variant="secondary"
                  className="w-fit capitalize"
                  style={{
                    backgroundColor: `${theme.colors.primary}1A`,
                    color: theme.colors.primary,
                    borderColor: `${theme.colors.primary}33`,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  {product.category.name}
                </Badge>
              )}
              {product.sub_category?.name && (
                <Badge
                  variant="outline"
                  className="w-fit capitalize"
                  style={{
                    backgroundColor: `${theme.colors.primary}0D`,
                    color: theme.colors.primary,
                    borderColor: `${theme.colors.primary}26`,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  {product.sub_category.name}
                </Badge>
              )}
              {product.is_featured && (
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.secondaryForeground,
                  }}
                >
                  Featured
                </Badge>
              )}
              {product.is_popular && (
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                >
                  Popular
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge
                  className="text-xs font-bold"
                  style={{
                    backgroundColor: "#FEE2E2",
                    color: "#B91C1C",
                    borderColor: "#FCA5A5",
                  }}
                >
                  -{discountPercentage}%
                </Badge>
              )}
              {currentStock === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Sold Out
                </Badge>
              )}
              {currentStock > 0 && currentStock <= 5 && (
                <Badge className="text-xs">Only {currentStock} left</Badge>
              )}
            </div>

            <div className="flex items-start justify-between">
              <h1 className="text-foreground mt-2 text-3xl font-bold md:text-4xl">
                {product.name || "Untitled Product"}
              </h1>
            </div>

            {reviewsCount > 0 ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-current"
                      style={
                        i < Math.round(rating)
                          ? { color: theme.colors.secondary }
                          : { color: "#9CA3AF4D" }
                      }
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  {rating.toFixed(1)} ({reviewsCount} review
                  {reviewsCount !== 1 ? "s" : ""})
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5"
                      style={{ color: "#9CA3AF4D" }}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  No reviews yet
                </span>
              </div>
            )}

            <div className="my-6">
              <span
                className="text-4xl font-extrabold"
                style={{ color: theme.colors.primary }}
              >
                ${discountedPrice}
              </span>
              {marketPrice && discountPercentage > 0 && (
                <>
                  <span className="text-muted-foreground ml-3 text-xl line-through">
                    ${marketPrice.toFixed(2)}
                  </span>
                  <Badge variant="destructive" className="ml-3">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>

            {product.description && (
              <div
                className="text-foreground/80 prose prose-sm max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {product.options && product.options.length > 0 && (
              <div className="mt-6 space-y-4">
                {product.options.map(option => {
                  const values =
                    option.values?.map(v =>
                      typeof v === "string"
                        ? { value: v }
                        : (v as { value: string })
                    ) || [];
                  return (
                    <div key={`${option.id || option.name}`}>
                      <label className="text-foreground mb-2 block text-sm font-medium capitalize">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {values.map(value => {
                          const isSelected =
                            selectedOptions[option.name] === value.value;
                          const isAvailable = isOptionValueAvailable(
                            option.name,
                            value.value
                          );
                          return (
                            <Button
                              key={`${option.name}-${value.value}`}
                              variant={isSelected ? "default" : "outline"}
                              className={`relative min-w-[80px] capitalize ${!isAvailable ? "opacity-50" : ""}`}
                              style={
                                isSelected
                                  ? primaryButtonStyle
                                  : outlineButtonStyle
                              }
                              onClick={() =>
                                setSelectedOptions(prev => ({
                                  ...prev,
                                  [option.name]: value.value,
                                }))
                              }
                              disabled={!isAvailable}
                            >
                              {value.value}
                              {!isAvailable && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-foreground h-px w-full rotate-[-20deg]" />
                                </div>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    style={outlineButtonStyle}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={e =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center"
                    min="1"
                    max={currentStock}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    style={outlineButtonStyle}
                    onClick={() =>
                      setQuantity(q => Math.min(currentStock, q + 1))
                    }
                  >
                    +
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Stock:</span>
                  <Badge variant={currentStock > 0 ? "default" : "destructive"}>
                    {currentStock > 0
                      ? `${currentStock} available`
                      : "Out of stock"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled
                  style={primaryButtonStyle}
                >
                  Add to Cart (Preview)
                </Button>
              </div>
            </div>

            <Accordion type="single" collapsible className="mt-6 w-full">
              <AccordionItem value="specifications">
                <AccordionTrigger>Product Specifications</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {product.id && (
                      <div className="flex justify-between">
                        <span className="font-medium">Product ID:</span>
                        <span className="text-muted-foreground">
                          {String(product.id)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Price:</span>
                      <span className="text-muted-foreground">
                        ${discountedPrice}
                      </span>
                    </div>
                    {product.market_price && (
                      <div className="flex justify-between">
                        <span className="font-medium">Market Price:</span>
                        <span className="text-muted-foreground">
                          ${product.market_price}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Stock:</span>
                      <span className="text-muted-foreground">
                        {currentStock} units
                      </span>
                    </div>
                    {product.category?.name && (
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <span className="text-muted-foreground">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                    {product.sub_category?.name && (
                      <div className="flex justify-between">
                        <span className="font-medium">Subcategory:</span>
                        <span className="text-muted-foreground">
                          {product.sub_category.name}
                        </span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewDetail;
