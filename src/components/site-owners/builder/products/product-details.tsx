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
import {
  AlertCircle,
  Star,
  ShieldCheck,
  Truck,
  PackageCheck,
  Home,
  Heart,
} from "lucide-react";
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
import { useAuth } from "@/hooks/customer/use-auth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ProductDetailProps {
  slug: string;
  siteUser?: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  slug,
  siteUser,
}) => {
  const { data: product, isLoading, error } = useProduct(slug);
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults (consistent with product-card4)
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

  // Common themed styles for buttons and selected states
  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
    borderColor: theme.colors.primary,
  };
  const outlineButtonStyle: React.CSSProperties = {
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  };
  const subtlePrimaryBg = `${theme.colors.primary}1A`; // ~10% opacity overlay
  const subtleSecondaryBg = `${theme.colors.secondary}1A`;

  // Variant selection state
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string>
  >({});
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVariant, setSelectedVariant] = React.useState<any>(null);

  // Wishlist hooks
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Default fallback image
  const defaultImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

  React.useEffect(() => {
    if (product && !selectedImage) {
      setSelectedImage(product.thumbnail_image || defaultImage);
    }
  }, [product, selectedImage]);

  // Initialize selected options when product loads
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

  // Find matching variant when options change
  React.useEffect(() => {
    if (product?.variants_read && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = product.variants_read.find(variant => {
        return Object.entries(selectedOptions).every(
          ([optionName, optionValue]) =>
            variant.option_values[optionName] === optionValue
        );
      });

      setSelectedVariant(matchingVariant || null);

      // Update selected image if variant has an image
      if (matchingVariant?.image) {
        setSelectedImage(matchingVariant.image);
      } else if (product.thumbnail_image) {
        setSelectedImage(product.thumbnail_image);
      }
    }
  }, [selectedOptions, product]);

  // Check if product is in wishlist
  const wishlistItem = wishlistItems?.find(
    item => item.product.id === product?.id
  );
  const isWishlisted = !!wishlistItem;

  const isWishlistLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  const handleFavorite = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    try {
      if (isWishlisted && wishlistItem) {
        await removeFromWishlistMutation.mutateAsync(wishlistItem.id);
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        await addToWishlistMutation.mutateAsync(product.id);
        toast.success(`${product.name} added to wishlist!`);
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

  // Get current price and stock based on selected variant or product default
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

  // Check if a specific option value combination is available
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
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-20 w-20 rounded" />
                <Skeleton className="h-20 w-20 rounded" />
                <Skeleton className="h-20 w-20 rounded" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/products">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Error</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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

  // Replace your handleAddToCart function with this:

  const handleAddToCart = () => {
    if (product) {
      const currentStock = getCurrentStock();
      if (currentStock === 0) {
        toast.error("This item is out of stock");
        return;
      }

      // Check if product has variants but none is selected
      if (
        product.variants_read &&
        product.variants_read.length > 0 &&
        !selectedVariant
      ) {
        toast.error("Please select all product options");
        return;
      }

      // Prepare variant data if a variant is selected
      const variantData = selectedVariant
        ? {
            id: selectedVariant.id,
            price: selectedVariant.price,
            option_values: selectedVariant.option_values,
          }
        : null;

      // Add to cart with variant information
      addToCart(product, quantity, variantData);

      // Show success message with variant info
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

  const productImages = [
    product.thumbnail_image,
    ...(product.images || []).map(img => img.image),
  ].filter((img): img is string => Boolean(img));

  if (productImages.length === 0) {
    productImages.push(defaultImage);
  }

  return (
    <div className="bg-background pt-5 pb-80">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/preview/${siteUser}`}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/preview/${siteUser}/products-draft`}>
                  Products
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {product.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/preview/${siteUser}/products-draft?category=${product.category.slug}`}
                    >
                      {product.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
              {productImages.slice(0, 5).map((img, idx) => (
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
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = defaultImage;
                    }}
                  />
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              {product.category && (
                <Badge
                  variant="secondary"
                  className="w-fit capitalize"
                  style={{
                    backgroundColor: `${theme.colors.primary}1A`, // subtle tint of primary
                    color: theme.colors.primary,
                    borderColor: `${theme.colors.primary}33`,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  {product.category.name}
                </Badge>
              )}
              {product.sub_category && (
                <Badge
                  variant="outline"
                  className="w-fit capitalize"
                  style={{
                    backgroundColor: `${theme.colors.primary}0D`, // even lighter tint
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
                    backgroundColor: "#FEE2E2", // subtle red background
                    color: "#B91C1C", // readable red text
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
                {product.name}
              </h1>

              <Button
                variant="ghost"
                size="icon"
                className="mt-2 h-10 w-10 transition-colors"
                style={
                  isWishlisted
                    ? {
                        backgroundColor: subtleSecondaryBg,
                        color: theme.colors.secondary,
                      }
                    : { backgroundColor: "#F9FAFB", color: theme.colors.text }
                }
                onClick={handleFavorite}
                disabled={isWishlistLoading}
                data-wishlist="true"
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""} ${
                    isWishlistLoading ? "animate-pulse" : ""
                  }`}
                />
              </Button>
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

            {/* Variant Selection */}
            {product.options && product.options.length > 0 && (
              <div className="mt-6 space-y-4">
                {product.options.map(option => (
                  <div key={option.id}>
                    <label className="text-foreground mb-2 block text-sm font-medium capitalize">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
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
                            className={`relative min-w-[80px] capitalize ${
                              !isAvailable ? "opacity-50" : ""
                            }`}
                            style={
                              isSelected
                                ? primaryButtonStyle
                                : outlineButtonStyle
                            }
                            onClick={() =>
                              handleOptionChange(option.name, value.value)
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
                ))}
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
                  disabled={currentStock === 0}
                  style={primaryButtonStyle}
                  onClick={handleAddToCart}
                >
                  {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 text-center text-sm sm:grid-cols-3">
              <div className="bg-muted/50 flex flex-col items-center gap-2 rounded-lg p-4">
                <Truck
                  className="h-6 w-6"
                  style={{ color: theme.colors.primary }}
                />
                <span className="text-foreground font-medium">
                  Fast Shipping
                </span>
              </div>
              <div className="bg-muted/50 flex flex-col items-center gap-2 rounded-lg p-4">
                <ShieldCheck
                  className="h-6 w-6"
                  style={{ color: theme.colors.primary }}
                />
                <span className="text-foreground font-medium">
                  1 Year Warranty
                </span>
              </div>
              <div className="bg-muted/50 flex flex-col items-center gap-2 rounded-lg p-4">
                <PackageCheck
                  className="h-6 w-6"
                  style={{ color: theme.colors.primary }}
                />
                <span
                  className="font-medium"
                  style={
                    currentStock > 0
                      ? { color: theme.colors.secondary }
                      : undefined
                  }
                >
                  {currentStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <Accordion type="single" collapsible className="mt-6 w-full">
              <AccordionItem value="specifications">
                <AccordionTrigger>Product Specifications</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Product ID:</span>
                      <span className="text-muted-foreground">
                        {product.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">SKU:</span>
                      <span className="text-muted-foreground">
                        {product.slug}
                      </span>
                    </div>
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
                    {product.category && (
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <span className="text-muted-foreground">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                    {product.sub_category && (
                      <div className="flex justify-between">
                        <span className="font-medium">Subcategory:</span>
                        <span className="text-muted-foreground">
                          {product.sub_category.name}
                        </span>
                      </div>
                    )}
                    {selectedVariant && (
                      <div className="mt-2 border-t pt-2">
                        <p className="mb-2 font-medium">Selected Variant:</p>
                        {Object.entries(selectedOptions).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium capitalize">
                              {key}:
                            </span>
                            <span className="text-muted-foreground capitalize">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Average Rating:</span>
                      <span className="text-muted-foreground">
                        {rating > 0
                          ? `${rating.toFixed(1)}/5`
                          : "No ratings yet"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Reviews:</span>
                      <span className="text-muted-foreground">
                        {reviewsCount}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger>
                  Customer Reviews ({reviewsCount})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {reviewsCount > 0 ? (
                      <>
                        <div className="border-border border-b pb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div
                                className="text-3xl font-bold"
                                style={{ color: theme.colors.primary }}
                              >
                                {rating.toFixed(1)}
                              </div>
                              <div className="flex items-center justify-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-current"
                                    style={
                                      i < Math.round(rating)
                                        ? { color: theme.colors.secondary }
                                        : { color: "#9CA3AF4D" }
                                    }
                                  />
                                ))}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Based on {reviewsCount} review
                                {reviewsCount !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="border-border border-b pb-3 last:border-b-0">
                            <div className="flex items-center justify-between">
                              <span className="text-foreground font-semibold">
                                Customer Review
                              </span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-current"
                                    style={
                                      i < Math.round(rating)
                                        ? { color: theme.colors.secondary }
                                        : { color: "#9CA3AF4D" }
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              Reviews will be displayed here when available from
                              your API.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground py-8 text-center">
                        <Star className="text-muted-foreground/30 mx-auto mb-2 h-12 w-12" />
                        <p>No reviews yet</p>
                        <p className="text-sm">
                          Be the first to review this product!
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              {product.category && product.category.description && (
                <AccordionItem value="category-info">
                  <AccordionTrigger>
                    About {product.category.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      {product.category.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {product.sub_category && product.sub_category.description && (
                <AccordionItem value="subcategory-info">
                  <AccordionTrigger>
                    About {product.sub_category.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      {product.sub_category.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};
