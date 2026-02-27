"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useProduct } from "@/hooks/owner-site/admin/use-product";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlertCircle, Star, Home, Heart, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/customer/use-wishlist";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { useRecentlyViewed } from "@/hooks/customer/use-recently-viewed";
import { ProductRecommendations } from "../product-recommendations";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface ProductDetailProps {
  slug: string;
  siteUser?: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  slug,
  siteUser,
}) => {
  const pathname = usePathname();
  const { data: product, isLoading, error } = useProduct(slug);
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const { data: themeResponse } = useThemeQuery();
  const { addRecentlyViewed } = useRecentlyViewed();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
    borderColor: theme.colors.primary,
  };

  const outlineButtonStyle: React.CSSProperties = {
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  };

  const subtleSecondaryBg = `${theme.colors.secondary}1A`;

  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string>
  >({});
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVariant, setSelectedVariant] = React.useState<any>(null);

  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const defaultImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

  React.useEffect(() => {
    if (product && !selectedImage) {
      setSelectedImage(product.thumbnail_image || defaultImage);
    }
  }, [product, selectedImage]);

  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  React.useEffect(() => {
    if (product?.options && product.options.length > 0) {
      const initialOptions: Record<string, string> = {};
      product.options.forEach(option => {
        if (option.values && option.values.length > 0) {
          initialOptions[option.name] = option.values[0].value;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  React.useEffect(() => {
    if (product?.variants_read && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = product.variants_read.find(variant => {
        return Object.entries(selectedOptions).every(
          ([optionName, optionValue]) =>
            variant.option_values[optionName] === optionValue
        );
      });

      setSelectedVariant(matchingVariant || null);

      if (matchingVariant?.image) {
        setSelectedImage(matchingVariant.image);
      } else if (product.thumbnail_image) {
        setSelectedImage(product.thumbnail_image);
      }
    }
  }, [selectedOptions, product]);

  const wishlistItem = wishlistItems?.find(
    item => item.product.id === product?.id
  );
  const isWishlisted = !!wishlistItem;

  const isWishlistLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  const handleFavorite = async () => {
    if (!product) return;

    try {
      if (isWishlisted && wishlistItem) {
        await removeFromWishlistMutation.mutateAsync(wishlistItem.id);
      } else {
        await addToWishlistMutation.mutateAsync(product);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const getCurrentPrice = () => {
    if (selectedVariant?.price) {
      return parseFloat(selectedVariant.price);
    }
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

    const testOptions = { ...selectedOptions, [optionName]: value };

    return product.variants_read.some(variant => {
      const matches = Object.entries(testOptions).every(
        ([name, val]) => variant.option_values[name] === val
      );
      return matches && variant.stock > 0;
    });
  };

  if (isLoading) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="mt-4 flex gap-4">
                <Skeleton className="h-24 w-24 rounded-xl" />
                <Skeleton className="h-24 w-24 rounded-xl" />
                <Skeleton className="h-24 w-24 rounded-xl" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Could not load product details. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      const currentStock = getCurrentStock();
      if (currentStock === 0) {
        toast.error("This item is out of stock");
        return;
      }

      if (
        product.variants_read &&
        product.variants_read.length > 0 &&
        !selectedVariant
      ) {
        toast.error("Please select all product options");
        return;
      }

      const variantData = selectedVariant
        ? {
            id: selectedVariant.id,
            price: selectedVariant.price,
            option_values: selectedVariant.option_values,
          }
        : null;

      addToCart(product, quantity, variantData);

      const variantInfo = selectedVariant
        ? ` (${Object.entries(selectedOptions)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")})`
        : "";

      toast.success(
        `${quantity} x ${product.name}${variantInfo} added to cart!`
      );
    }
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

  const allImages = [
    product.thumbnail_image,
    ...(product.images || []).map(img => img.image),
  ].filter((img): img is string => Boolean(img));

  const uniqueImages: string[] = [];
  allImages.forEach(img => {
    const getBaseName = (url: string) => {
      try {
        return new URL(url, "http://dummy.com").pathname;
      } catch {
        return url.split("?")[0];
      }
    };

    const imgBaseName = getBaseName(img);
    if (!uniqueImages.some(existing => getBaseName(existing) === imgBaseName)) {
      uniqueImages.push(img);
    }
  });

  const productImages = uniqueImages;

  if (productImages.length === 0) {
    productImages.push(defaultImage);
  }

  return (
    <div className="bg-background pt-8 pb-32">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-10 text-sm font-medium">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={
                    siteUser
                      ? pathname?.includes("/preview/")
                        ? `/preview/${siteUser}`
                        : pathname?.includes("/publish/")
                          ? ``
                          : "/"
                      : "/"
                  }
                  className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                >
                  <Home className="mb-0.5 h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={
                    siteUser
                      ? pathname?.includes("/preview/")
                        ? `/preview/${siteUser}/collections`
                        : pathname?.includes("/publish/")
                          ? `/collections`
                          : "/collections"
                      : "/collections"
                  }
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Collections
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {product.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={
                        siteUser
                          ? pathname?.includes("/preview/")
                            ? `/preview/${siteUser}/collections?${product.category.slug ? `category=${product.category.slug}` : `category_id=${product.category.id}`}`
                            : pathname?.includes("/publish/")
                              ? `/collections?${product.category.slug ? `category=${product.category.slug}` : `category_id=${product.category.id}`}`
                              : `/collections?${product.category.slug ? `category=${product.category.slug}` : `category_id=${product.category.id}`}`
                          : `/collections?${product.category.slug ? `category=${product.category.slug}` : `category_id=${product.category.id}`}`
                      }
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {product.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid items-start gap-12 md:grid-cols-12 lg:gap-16">
          {/* Left Column: Traditional Image Gallery */}
          <div className="flex flex-col gap-4 md:col-span-6 lg:col-span-7">
            <div className="border-border bg-card relative aspect-[4/5] w-full overflow-hidden rounded-3xl border shadow-sm">
              <Image
                src={selectedImage || defaultImage}
                alt={product.thumbnail_alt_description || product.name}
                fill
                className="object-cover"
                onError={e => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = defaultImage;
                }}
                priority
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold shadow-md">
                    -{discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {productImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 transition-all focus:outline-none ${
                      selectedImage === img
                        ? "border-primary shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      onError={e => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = defaultImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product details and actions */}
          <div className="flex flex-col md:sticky md:top-24 md:col-span-6 lg:col-span-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {product.category && (
                <Badge
                  variant="secondary"
                  className="w-fit capitalize"
                  style={{
                    backgroundColor: `${theme.colors.primary}1A`,
                    color: theme.colors.primary,
                    borderColor: `${theme.colors.primary}33`,
                  }}
                >
                  {product.category.name}
                </Badge>
              )}
              {product.is_featured && (
                <Badge
                  className="text-xs font-bold tracking-wider uppercase"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.text,
                  }}
                >
                  Featured
                </Badge>
              )}
              {currentStock === 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs font-bold tracking-wider uppercase"
                >
                  Sold Out
                </Badge>
              )}
              {currentStock > 0 && currentStock <= 5 && (
                <Badge className="bg-amber-500 text-xs font-bold tracking-wider text-white uppercase hover:bg-amber-600">
                  Low Stock
                </Badge>
              )}
            </div>

            <h1
              className="text-foreground mb-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
              style={{ fontFamily: theme.fonts.heading }}
            >
              {product.name}
            </h1>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5"
                      style={{
                        fill:
                          i < Math.round(rating)
                            ? theme.colors.secondary
                            : "transparent",
                        color:
                          i < Math.round(rating)
                            ? theme.colors.secondary
                            : "#9CA3AF4D",
                      }}
                    />
                  ))}
                </div>
                {reviewsCount > 0 ? (
                  <span className="text-muted-foreground text-sm font-medium">
                    {rating.toFixed(1)} ({reviewsCount})
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm font-medium">
                    No reviews
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8 flex items-end gap-4">
              <span
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: theme.colors.primary }}
              >
                Rs.{Number(discountedPrice).toLocaleString("en-IN")}
              </span>
              {marketPrice && discountPercentage > 0 && (
                <span className="text-muted-foreground mb-1 text-xl line-through">
                  Rs.{Number(marketPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {product.description && (
              <div
                className="text-foreground/80 prose prose-base dark:prose-invert mb-8 max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeContent(product.description),
                }}
              />
            )}

            {/* Clean Variant Selection */}
            {product.options && product.options.length > 0 && (
              <div className="bg-muted/30 border-border/50 mb-8 space-y-6 rounded-2xl border p-6">
                {product.options.map(option => (
                  <div key={option.id}>
                    <label className="text-foreground mb-3 block text-sm font-bold tracking-wider uppercase">
                      {option.name}{" "}
                      <span className="text-muted-foreground ml-2 font-normal normal-case">
                        - {selectedOptions[option.name] || "Select an option"}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {option.values?.map(value => {
                        const isSelected =
                          selectedOptions[option.name] === value.value;
                        const isAvailable = isOptionValueAvailable(
                          option.name,
                          value.value
                        );

                        return (
                          <Button
                            key={value.id}
                            variant={isSelected ? "default" : "outline"}
                            className={`relative min-w-[5rem] px-5 py-6 font-medium capitalize transition-all duration-200 ${
                              !isAvailable
                                ? "bg-muted cursor-not-allowed opacity-30 hover:opacity-30"
                                : "shadow-sm hover:shadow-md"
                            }`}
                            style={
                              isSelected
                                ? primaryButtonStyle
                                : outlineButtonStyle
                            }
                            onClick={() =>
                              isAvailable &&
                              handleOptionChange(option.name, value.value)
                            }
                            disabled={!isAvailable}
                          >
                            {value.value}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Area */}
            <div className="border-border border-t pt-6">
              <div className="mb-4 flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="bg-background flex items-center overflow-hidden rounded-full border p-1 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted h-10 w-10 shrink-0 rounded-full"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={currentStock === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    value={quantity}
                    onChange={e =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="h-10 w-14 border-0 px-0 text-center text-base font-semibold focus-visible:ring-0"
                    min="1"
                    max={currentStock}
                    disabled={currentStock === 0}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted h-10 w-10 shrink-0 rounded-full"
                    onClick={() =>
                      setQuantity(q => Math.min(currentStock, q + 1))
                    }
                    disabled={currentStock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add to Cart */}
                <Button
                  size="lg"
                  className="h-14 flex-1 rounded-full text-lg font-bold shadow-lg transition-transform hover:scale-[1.02]"
                  disabled={currentStock === 0}
                  style={primaryButtonStyle}
                  onClick={handleAddToCart}
                >
                  {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                {/* Wishlist */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 shrink-0 rounded-full border-2 transition-all hover:scale-[1.02]"
                  style={
                    isWishlisted
                      ? {
                          backgroundColor: subtleSecondaryBg,
                          borderColor: theme.colors.secondary,
                          color: theme.colors.secondary,
                        }
                      : {
                          borderColor: theme.colors.primary,
                          color: theme.colors.primary,
                        }
                  }
                  onClick={handleFavorite}
                  disabled={isWishlistLoading}
                >
                  <Heart
                    className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""} ${
                      isWishlistLoading ? "animate-pulse" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Accordions */}
            <Accordion
              type="single"
              collapsible
              className="border-border mt-10 w-full border-t"
            >
              <AccordionItem
                value="specifications"
                className="border-border border-b py-2"
              >
                <AccordionTrigger className="hover:text-primary text-lg font-semibold transition-colors hover:no-underline">
                  Product Specifications
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground space-y-3 pt-2 text-base">
                    <div className="border-border/50 flex justify-between border-b pb-2">
                      <span className="text-foreground font-medium">
                        Stock Availability:
                      </span>
                      <span>{currentStock} units perfectly ready</span>
                    </div>
                    {product.category && (
                      <div className="border-border/50 flex justify-between border-b pb-2">
                        <span className="text-foreground font-medium">
                          Category:
                        </span>
                        <span>{product.category.name}</span>
                      </div>
                    )}
                    {product.sub_category && (
                      <div className="border-border/50 flex justify-between border-b pb-2">
                        <span className="text-foreground font-medium">
                          Subcategory:
                        </span>
                        <span>{product.sub_category.name}</span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="reviews"
                className="border-border border-b py-2"
              >
                <AccordionTrigger className="hover:text-primary text-lg font-semibold transition-colors hover:no-underline">
                  Customer Reviews ({reviewsCount})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {reviewsCount > 0 ? (
                      <div className="bg-muted/30 flex items-center gap-4 rounded-xl border p-6">
                        <div className="w-full text-center">
                          <div
                            className="mb-2 text-5xl font-black"
                            style={{ color: theme.colors.primary }}
                          >
                            {rating.toFixed(1)}
                          </div>
                          <div className="mb-1 flex items-center justify-center">
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
                          <div className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                            Based on {reviewsCount} review
                            {reviewsCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground rounded-xl border-2 border-dashed px-6 py-10 text-center">
                        <Star className="text-muted-foreground/20 mx-auto mb-3 h-12 w-12" />
                        <p className="text-foreground mb-1 text-lg font-medium">
                          No reviews yet
                        </p>
                        <p className="text-sm">
                          Be the first to experience and review this product!
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {product && (
        <ProductRecommendations currentProduct={product} siteUser={siteUser} />
      )}
    </div>
  );
};
