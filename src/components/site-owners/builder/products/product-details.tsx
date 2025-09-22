"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useProduct } from "@/hooks/owner-site/admin/use-product";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
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
      // Use actual product image from API or fallback to default
      setSelectedImage(product.thumbnail_image || defaultImage);
    }
  }, [product, selectedImage]);

  // Check if product is in wishlist
  const wishlistItem = wishlistItems?.find(
    item => item.product.id === product?.id
  );
  const isWishlisted = !!wishlistItem;

  // Check if wishlist operations are loading
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
        // Remove from wishlist
        await removeFromWishlistMutation.mutateAsync(wishlistItem.id);
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        // Add to wishlist
        await addToWishlistMutation.mutateAsync(product.id);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (error) {
      // Error handling is already done in the mutation hooks
      console.error("Wishlist operation failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
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

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  // Parse price to float for calculations
  const price = parseFloat(product.price);
  const marketPrice = product.market_price
    ? parseFloat(product.market_price)
    : null;

  // Calculate discount if market price exists and is higher than current price
  const discountPercentage =
    marketPrice && marketPrice > price
      ? Math.round(((marketPrice - price) / marketPrice) * 100)
      : 0;

  const discountedPrice = price.toFixed(2);

  // Use real rating data from API
  const rating = product.average_rating || 0;
  const reviewsCount = product.reviews_count || 0;

  // Create image gallery from product data - filter out null/undefined values
  const productImages = [
    product.thumbnail_image,
    ...(product.images || []).map(img => img.image),
  ].filter((img): img is string => Boolean(img));

  // Ensure we always have at least one image (fallback)
  if (productImages.length === 0) {
    productImages.push(defaultImage);
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-8">
        {/* Breadcrumb Navigation */}
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
                <Link href={`/preview/${siteUser}/products`}>Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {product.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/preview/${siteUser}/products?category=${product.category.slug}`}
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
                  className={`relative aspect-square overflow-hidden p-0 ${
                    selectedImage === img ? "ring-primary ring-2" : ""
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
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              {product.category && (
                <Badge variant="secondary" className="w-fit capitalize">
                  {product.category.name}
                </Badge>
              )}
              {product.sub_category && (
                <Badge variant="outline" className="w-fit capitalize">
                  {product.sub_category.name}
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-yellow-500 text-black">Featured</Badge>
              )}
              {product.is_popular && (
                <Badge className="bg-red-500">Popular</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs font-bold">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Sold Out
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge className="text-xs">Only {product.stock} left</Badge>
              )}
            </div>

            <div className="flex items-start justify-between">
              <h1 className="text-foreground mt-2 text-3xl font-bold md:text-4xl">
                {product.name}
              </h1>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`mt-2 h-10 w-10 transition-colors ${
                  isWishlisted
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={handleFavorite}
                disabled={isWishlistLoading}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""} ${
                    isWishlistLoading ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Rating Section - Show actual rating data */}
            {reviewsCount > 0 ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground/30"
                      }`}
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
                      className="text-muted-foreground/30 h-5 w-5"
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  No reviews yet
                </span>
              </div>
            )}

            <div className="my-6">
              <span className="text-primary text-4xl font-extrabold">
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
              <p className="text-foreground/80 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="mt-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
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
                    max={product.stock}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity(q => Math.min(product.stock, q + 1))
                    }
                  >
                    +
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Stock:</span>
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                  >
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 text-center text-sm sm:grid-cols-3">
              <div className="bg-muted/50 flex flex-col items-center gap-2 rounded-lg p-4">
                <Truck className="text-primary h-6 w-6" />
                <span className="text-foreground font-medium">
                  Fast Shipping
                </span>
              </div>
              <div className="bg-muted/50 flex flex-col items-center gap-2 rounded-lg p-4">
                <ShieldCheck className="text-primary h-6 w-6" />
                <span className="text-foreground font-medium">
                  1 Year Warranty
                </span>
              </div>
              <div className="bg-muted/50 flex flex-col items-center gap-2 rounded-lg p-4">
                <PackageCheck className="text-primary h-6 w-6" />
                <span className="font-medium text-green-600">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
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
                        ${product.price}
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
                        {product.stock} units
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
                    <div className="flex justify-between">
                      <span className="font-medium">Created:</span>
                      <span className="text-muted-foreground">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Updated:</span>
                      <span className="text-muted-foreground">
                        {new Date(product.updated_at).toLocaleDateString()}
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
                        {/* Overall Rating Summary */}
                        <div className="border-border border-b pb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-primary text-3xl font-bold">
                                {rating.toFixed(1)}
                              </div>
                              <div className="flex items-center justify-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.round(rating)
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted-foreground/30"
                                    }`}
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

                        {/* Placeholder reviews - Replace with actual review data when available */}
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
                                    className={`h-4 w-4 ${
                                      i < Math.round(rating)
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted-foreground/30"
                                    }`}
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
