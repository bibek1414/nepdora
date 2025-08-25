"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useProduct } from "@/hooks/use-product";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/hooks/owner-site/use-cart";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
interface ProductDetailProps {
  slug: string;
  siteId?: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  slug,
  siteId,
}) => {
  const { data: product, isLoading, error } = useProduct(slug);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  // Mock image placeholder since the API product structure doesn't include images
  const mockImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

  React.useEffect(() => {
    if (product && !selectedImage) {
      // Since API product doesn't have images, use a placeholder
      setSelectedImage(mockImage);
    }
  }, [product, selectedImage]);

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

  // Generate mock images array for the gallery
  const mockImages = [
    mockImage,
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=top",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=left",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=right",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=bottom",
  ];
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    }
  };
  // Parse price to float for calculations
  const price = parseFloat(product.price);
  const discountPercentage = 15; // Mock discount since API doesn't provide it
  const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);
  const rating = 4.5; // Mock rating since API doesn't provide it

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/preview?site=${siteId}&page=home`}
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
                <Link href={`/preview?site=${siteId}&page=products`}>
                  Products
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
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
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {mockImages.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === img
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit capitalize">
              Electronics
            </Badge>
            <h1 className="text-foreground mt-2 text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                {rating} (42 reviews)
              </span>
            </div>

            <div className="my-6">
              <span className="text-primary text-4xl font-extrabold">
                ${discountedPrice}
              </span>
              <span className="text-muted-foreground ml-3 text-xl line-through">
                ${price.toFixed(2)}
              </span>
              <Badge variant="destructive" className="ml-3">
                {discountPercentage}% OFF
              </Badge>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              {product.description}
            </p>

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

              <Button
                size="lg"
                className="w-full"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
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
                      <span className="font-medium">Price:</span>
                      <span className="text-muted-foreground">
                        ${product.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Stock:</span>
                      <span className="text-muted-foreground">
                        {product.stock} units
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger>Customer Reviews</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Mock reviews since API doesn't provide them */}
                    <div className="border-border border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-semibold">
                          John Doe
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 5
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Excellent product! Great quality and fast delivery.
                      </p>
                    </div>
                    <div className="border-border border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-semibold">
                          Jane Smith
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Very satisfied with this purchase. Highly recommended!
                      </p>
                    </div>
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
