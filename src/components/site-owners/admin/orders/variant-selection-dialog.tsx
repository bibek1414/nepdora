"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductVariantRead } from "@/types/owner-site/admin/product";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, PackageCheck, Truck, ShieldCheck } from "lucide-react";

interface VariantSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  variants: ProductVariantRead[];
  onVariantSelect: (variant: ProductVariantRead) => void;
  currentVariant?: ProductVariantRead | null;
  productDetails?: {
    description?: string;
    thumbnail_image?: string;
    average_rating?: number;
    reviews_count?: number;
    market_price?: string;
  };
}

export function VariantSelectionDialog({
  open,
  onOpenChange,
  productName,
  variants,
  onVariantSelect,
  currentVariant,
  productDetails,
}: VariantSelectionDialogProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    currentVariant?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Reset selection when dialog opens or product changes
  useEffect(() => {
    if (open) {
      setSelectedVariantId(currentVariant?.id || null);
      setQuantity(1);
      // Initialize selected options based on current variant or first available
      if (currentVariant) {
        setSelectedOptions(currentVariant.option_values);
      } else if (variants.length > 0) {
        setSelectedOptions(variants[0].option_values);
      }
    }
  }, [open, currentVariant, variants]);

  // Find matching variant when options change
  useEffect(() => {
    if (variants.length > 0 && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = variants.find(variant => {
        return Object.entries(selectedOptions).every(
          ([optionName, optionValue]) =>
            variant.option_values[optionName] === optionValue
        );
      });

      if (matchingVariant) {
        setSelectedVariantId(matchingVariant.id);
      }
    }
  }, [selectedOptions, variants]);

  const handleConfirm = () => {
    if (selectedVariantId) {
      const selectedVariant = variants.find(v => v.id === selectedVariantId);
      if (selectedVariant) {
        onVariantSelect(selectedVariant);
        onOpenChange(false);
      }
    }
  };

  const getVariantDisplayName = (variant: ProductVariantRead) => {
    const optionValues = Object.entries(variant.option_values)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    return optionValues || "Default Variant";
  };

  // Get available options for each option type
  const getAvailableOptions = () => {
    const options: Record<string, string[]> = {};

    variants.forEach(variant => {
      Object.entries(variant.option_values).forEach(([key, value]) => {
        if (!options[key]) {
          options[key] = [];
        }
        if (!options[key].includes(value)) {
          options[key].push(value);
        }
      });
    });

    return options;
  };

  // Check if a specific option value combination is available
  const isOptionValueAvailable = (optionName: string, value: string) => {
    const testOptions = { ...selectedOptions, [optionName]: value };
    return variants.some(variant => {
      const matches = Object.entries(testOptions).every(
        ([name, val]) => variant.option_values[name] === val
      );
      return matches && variant.stock > 0;
    });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const availableOptions = getAvailableOptions();
  const defaultImage =
    "/fallback/image-not-found.png";

  // Calculate price and discount
  const price = selectedVariant?.price ? parseFloat(selectedVariant.price) : 0;
  const marketPrice = productDetails?.market_price
    ? parseFloat(productDetails.market_price)
    : null;
  const discountPercentage =
    marketPrice && marketPrice > price
      ? Math.round(((marketPrice - price) / marketPrice) * 100)
      : 0;

  const currentStock = selectedVariant?.stock || 0;
  const rating = productDetails?.average_rating || 0;
  const reviewsCount = productDetails?.reviews_count || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Select Variant
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div>
            <div className="border-border relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={
                  selectedVariant?.image ||
                  productDetails?.thumbnail_image ||
                  defaultImage
                }
                alt={productName}
                fill
                className="object-contain"
                onError={e => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
            </div>

            {/* Additional variant images can go here */}
            {selectedVariant?.image && (
              <div className="mt-4 flex gap-2">
                <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                  <Image
                    src={selectedVariant.image}
                    alt="Selected variant"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {productName}
              </h1>

              {/* Rating */}
              {reviewsCount > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-current"
                        style={
                          i < Math.round(rating)
                            ? { color: "#F59E0B" }
                            : { color: "#9CA3AF4D" }
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {rating.toFixed(1)} ({reviewsCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {price.toFixed(2)}
                </span>
                {marketPrice && discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      Rs. {marketPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Product Description */}
            {productDetails?.description && (
              <div className="mb-6">
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: productDetails.description,
                  }}
                />
              </div>
            )}

            {/* Variant Selection */}
            <div className="mb-6 space-y-4">
              {Object.entries(availableOptions).map(([optionName, values]) => (
                <div key={optionName}>
                  <Label className="mb-2 block text-sm font-medium text-gray-900 capitalize">
                    {optionName}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {values.map(value => {
                      const isSelected = selectedOptions[optionName] === value;
                      const isAvailable = isOptionValueAvailable(
                        optionName,
                        value
                      );

                      return (
                        <Button
                          key={value}
                          variant={isSelected ? "default" : "outline"}
                          className={`min-w-[80px] capitalize ${
                            !isAvailable ? "cursor-not-allowed opacity-50" : ""
                          }`}
                          onClick={() => handleOptionChange(optionName, value)}
                          disabled={!isAvailable}
                        >
                          {value}
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-px w-full rotate-[-20deg] bg-gray-400" />
                            </div>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Stock Information */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Badge variant={currentStock > 0 ? "default" : "destructive"}>
                  {currentStock > 0
                    ? `${currentStock} in stock`
                    : "Out of stock"}
                </Badge>
                {currentStock > 0 && currentStock <= 5 && (
                  <span className="text-sm text-orange-600">Low stock!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedVariantId || currentStock === 0}
            size="lg"
          >
            {currentStock === 0 ? "Out of Stock" : "Select Variant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
