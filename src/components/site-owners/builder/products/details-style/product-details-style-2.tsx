"use client";
import React, { useState } from "react";
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
import { Truck, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { useRecentlyViewed } from "@/hooks/customer/use-recently-viewed";
import { ProductRecommendations } from "../product-recommendations";

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
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { data: themeResponse } = useThemeQuery();
  const { addRecentlyViewed } = useRecentlyViewed();
  const [activeTab, setActiveTab] = useState("description");

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#C2F062", // Default to the lime green from the image if not set
      primaryForeground: "#000000",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

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

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <Skeleton className="mb-8 h-5 w-64" />
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <Skeleton className="aspect-4/3 w-full rounded-2xl" />
              <div className="mt-4 flex gap-4">
                <Skeleton className="h-24 w-24 rounded-xl" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="my-6 h-px w-full bg-gray-100" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-12 w-48 rounded-full" />
              <Skeleton className="my-6 h-px w-full bg-gray-100" />
              <Skeleton className="h-24 w-full" />
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

  const price = getCurrentPrice();
  const discountedPrice = price.toFixed(2);
  const currentStock = getCurrentStock();

  const productImages = [
    product.thumbnail_image,
    ...(product.images || []).map(img => img.image),
  ].filter((img): img is string => Boolean(img));

  if (productImages.length === 0) {
    productImages.push(defaultImage);
  }

  return (
    <div className="bg-background pt-8 pb-32 font-sans">
      <div className="container mx-auto max-w-7xl px-8 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList className="text-sm">
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
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
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
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  Shop
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {product.category && (
              <>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={
                        siteUser
                          ? pathname?.includes("/preview/")
                            ? `/preview/${siteUser}/collections?${product.category.slug ? `category=${product.category.slug}` : `category_id=${product.category.id}`}`
                            : `/collections?${product.category.slug ? `category=${product.category.slug}` : `category_id=${product.category.id}`}`
                          : `/collections`
                      }
                      className="text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {product.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-gray-900">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          {/* Left Side - Images */}
          <div className="flex flex-col gap-4">
            <div className="border-border relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#F6F6F6]">
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

            <div className="flex gap-4 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${selectedImage === img ? "border-black" : "border-transparent"}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="absolute inset-0 -z-10 bg-[#F6F6F6]" />
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = defaultImage;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col pt-2">
            <h1
              className="text-3xl font-medium tracking-tight text-gray-900 md:text-4xl"
              style={{ fontFamily: theme.fonts.heading }}
            >
              {product.name}
            </h1>

            <div className="my-5">
              <span
                className="text-2xl font-medium"
                style={{ fontFamily: theme.fonts.heading }}
              >
                Rs.{Number(discountedPrice).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="my-6 h-px w-full bg-gray-100" />

            {/* Options */}
            {product.options && product.options.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.options.map(option => (
                  <div key={option.id}>
                    <span className="mb-3 block text-sm font-medium text-gray-900">
                      {option.name}
                    </span>
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
                            variant="outline"
                            className={`rounded-full border-gray-200 px-6 font-medium transition-colors ${isSelected ? "border-black bg-black text-white hover:bg-black/90 hover:text-white" : "text-gray-600 hover:border-gray-900"} ${!isAvailable ? "cursor-not-allowed opacity-30" : ""}`}
                            onClick={() =>
                              !isAvailable
                                ? null
                                : handleOptionChange(option.name, value.value)
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

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-900">
                  Quantity
                </span>
                <div className="flex h-12 items-center overflow-hidden rounded-full border border-gray-200">
                  <Input
                    type="text"
                    value={quantity}
                    onChange={e =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="h-full w-16 border-none px-0 text-center font-medium shadow-none focus-visible:ring-0"
                    min="1"
                    max={currentStock || 1}
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="h-14 w-fit min-w-[180px] gap-2 rounded-full border border-black bg-white px-8 text-black transition-all duration-300 hover:bg-gray-50"
                disabled={currentStock === 0}
                onClick={handleAddToCart}
              >
                <img
                  src="/images/site-owners/bag.webp"
                  alt="Bag"
                  className="h-[18px] w-[18px] shrink-0 object-contain"
                />
                <span className="font-semibold">
                  {currentStock > 0 ? "Add to Bag" : "Out of Stock"}
                </span>
              </Button>
            </div>

            <div className="my-8 h-px w-full bg-gray-100" />

            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Get it today
              </h3>

              <div className="flex items-start gap-4">
                <Truck
                  className="mt-0.5 h-[22px] w-[22px] shrink-0 text-black"
                  strokeWidth={1.5}
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Fast Shipping
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    Free delivery when order from Rs. 500.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Tag
                  className="mt-0.5 h-[22px] w-[22px] shrink-0 rotate-90 transform text-black"
                  strokeWidth={1.5}
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    100 - Day Returns
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    Not impressed? Get a refund. You have 100 days to break our
                    hearts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-20 mb-10 w-full">
          <div className="flex w-full flex-nowrap gap-1 border-none md:gap-2">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 px-6 py-4 text-center text-sm font-medium shadow-sm transition-colors`}
              style={
                activeTab === "description"
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground || "#000",
                      borderTopLeftRadius: "6px",
                      borderTopRightRadius: "6px",
                    }
                  : {
                      backgroundColor: "#F9F9F9",
                      color: "#6B7280",
                      borderTopLeftRadius: "6px",
                      borderTopRightRadius: "6px",
                    }
              }
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 px-6 py-4 text-center text-sm font-medium shadow-sm transition-colors`}
              style={
                activeTab === "specifications"
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground || "#000",
                      borderTopLeftRadius: "6px",
                      borderTopRightRadius: "6px",
                    }
                  : {
                      backgroundColor: "#F9F9F9",
                      color: "#6B7280",
                      borderTopLeftRadius: "6px",
                      borderTopRightRadius: "6px",
                    }
              }
            >
              Specifications
            </button>
          </div>

          <div className="mt-6 px-2 md:mt-8 md:px-0">
            {activeTab === "description" && (
              <div
                className="prose prose-sm max-w-none text-[15px] leading-relaxed text-gray-600"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nisl augue, pharetra sed tellus a, accumsan feugiat neque. Maecenas eget lacinia odio. Proin leo purus, pretium vel eu ut, tempor vulputate leo. Integer faucibus, quam vitae tincidunt accumsan, dolor diam imperdiet nisl, a rhoncus tortor nunc vitae diam. Integer quis lobortis mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec velit diam, lacinia rutrum sagittis et, posuere vitae turpis.",
                }}
              />
            )}

            {activeTab === "specifications" && (
              <div className="space-y-4 text-[15px] text-gray-600">
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-3 lg:grid-cols-4">
                  <span className="font-medium text-gray-900">
                    Product Type
                  </span>
                  <span className="col-span-1 lg:col-span-3">
                    {product.category?.name || "Apparel"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-3 lg:grid-cols-4">
                  <span className="font-medium text-gray-900">
                    Stock Status
                  </span>
                  <span className="col-span-1 lg:col-span-3">
                    {currentStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-3 lg:grid-cols-4">
                  <span className="font-medium text-gray-900">
                    Average Rating
                  </span>
                  <span className="col-span-1 lg:col-span-3">
                    {product.average_rating
                      ? `${product.average_rating.toFixed(1)} / 5.0`
                      : "No ratings yet"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-3 lg:grid-cols-4">
                  <span className="font-medium text-gray-900">
                    Total Reviews
                  </span>
                  <span className="col-span-1 lg:col-span-3">
                    {product.reviews_count || 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {product && (
        <ProductRecommendations currentProduct={product} siteUser={siteUser} />
      )}
    </div>
  );
};
