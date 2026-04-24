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
import { sanitizeContent } from "@/utils/html-sanitizer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductDetailProps {
  slug: string;
  siteUser?: string;
}

export const ProductDetailStyle3: React.FC<ProductDetailProps> = ({
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
  const [selectedVariant, setSelectedVariant] = React.useState<any>(null);

  const { data: wishlistItems } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const defaultImage = "/fallback/image-not-found.png";

  React.useEffect(() => {
    if (product && !selectedImage) {
      setSelectedImage(product.thumbnail_image || defaultImage);
    }
  }, [product, selectedImage]);

  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product?.id, addRecentlyViewed]);

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
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
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
      toast.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const currentStock = getCurrentStock();
  const productImages = [
    product.thumbnail_image,
    ...(product.images || []).map(img => img.image),
  ].filter((img): img is string => Boolean(img));

  if (productImages.length === 0) {
    productImages.push(defaultImage);
  }

  return (
    <div className="bg-background pt-8 pb-32">
      <div className="mx-auto max-w-7xl px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-10 text-sm font-medium">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={siteUser ? (pathname?.includes("/preview/") ? `/preview/${siteUser}` : "/") : "/"}
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
                  href={siteUser ? (pathname?.includes("/preview/") ? `/preview/${siteUser}/collections` : "/collections") : "/collections"}
                  className="transition-colors"
                >
                  Collections
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid items-start gap-12 md:grid-cols-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-6 md:col-span-6 lg:col-span-7">
            <div className="bg-card relative aspect-square max-h-[600px] w-full overflow-hidden rounded-2xl border">
              <Image
                unoptimized
                src={selectedImage || defaultImage}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            {productImages.length > 1 && (
              <div className="relative px-2">
                <Carousel opts={{ align: "start" }} className="w-full">
                  <CarouselContent className="-ml-2">
                    {productImages.map((img, idx) => (
                      <CarouselItem key={idx} className="basis-1/4 pl-2">
                        <button
                          className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 transition-all ${
                            selectedImage === img ? "border-black shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                          onClick={() => setSelectedImage(img)}
                        >
                          <Image unoptimized src={img} alt={product.name} fill className="object-cover" />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col md:sticky md:top-24 md:col-span-6 lg:col-span-5">
            <div className="mb-4">
              {product.category && (
                <Badge variant="secondary" className="capitalize">
                  {product.category.name}
                </Badge>
              )}
            </div>

            <h1 className="text-foreground mb-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl" style={{ fontFamily: theme.fonts.heading }}>
              {product.name}
            </h1>

            {product.description && (
              <div
                className="text-foreground/80 prose prose-base dark:prose-invert mb-8 max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeContent(product.description) }}
              />
            )}

            {/* Variant Selection */}
            {product.options && product.options.length > 0 && (
              <div className="bg-muted/30 border-border/50 mb-8 space-y-6 rounded-2xl border p-6">
                {product.options.map(option => (
                  <div key={option.id}>
                    <label className="text-foreground mb-3 block text-sm font-bold tracking-wider uppercase">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {option.values?.map(value => {
                        const isSelected = selectedOptions[option.name] === value.value;
                        const isAvailable = isOptionValueAvailable(option.name, value.value);

                        return (
                          <Button
                            key={value.id}
                            variant={isSelected ? "default" : "outline"}
                            className="min-w-20 px-5 py-6 font-medium capitalize"
                            style={isSelected ? primaryButtonStyle : outlineButtonStyle}
                            onClick={() => isAvailable && handleOptionChange(option.name, value.value)}
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
                <div className="bg-background flex items-center overflow-hidden rounded-full border p-1 shadow-sm">
                  <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={currentStock === 0}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input type="text" value={quantity} readOnly className="h-10 w-14 border-0 px-0 text-center text-base font-semibold focus-visible:ring-0" />
                  <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full" onClick={() => setQuantity(q => Math.min(currentStock, q + 1))} disabled={currentStock === 0}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button size="lg" className="h-14 flex-1 rounded-full text-lg font-bold shadow-lg" disabled={currentStock === 0} style={primaryButtonStyle} onClick={handleAddToCart}>
                  {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button variant="outline" size="icon" className="h-14 w-14 shrink-0 rounded-full border-2" style={isWishlisted ? { color: theme.colors.secondary } : { color: theme.colors.primary }} onClick={handleFavorite} disabled={isWishlistLoading}>
                  <Heart className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
