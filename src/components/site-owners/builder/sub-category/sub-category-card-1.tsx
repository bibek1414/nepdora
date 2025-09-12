import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, ArrowRight, Tag } from "lucide-react";
import { SubCategory } from "@/types/owner-site/product";

interface SubCategoryCard1Props {
  subcategory: SubCategory;
  siteId?: string;
  showDescription?: boolean;
  showProductCount?: boolean;
  showParentCategory?: boolean;
  onClick?: () => void;
}

export const SubCategoryCard1: React.FC<SubCategoryCard1Props> = ({
  subcategory,
  siteId,
  showDescription = true,
  showProductCount = true,
  showParentCategory = true,
  onClick,
}) => {
  const subcategoryImage =
    subcategory.image ||
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

  const getSubCategoryUrl = (): string => {
    if (siteId) {
      return `/preview/${siteId}/products?sub_category=${subcategory.slug}`;
    } else {
      return `/preview/products?sub_category=${subcategory.slug}`;
    }
  };

  const handleViewSubCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const subcategoryUrl = getSubCategoryUrl();
    window.location.href = subcategoryUrl;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const subcategoryUrl = getSubCategoryUrl();
      window.location.href = subcategoryUrl;
    }
  };

  const subcategoryUrl = getSubCategoryUrl();

  // Handle category display (it could be object or string)
  const categoryName =
    typeof subcategory.category === "object" && subcategory.category
      ? subcategory.category.name
      : "Category";

  const CardWrapper = siteId
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={subcategoryUrl}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <Card className="group hover: overflow-hidden border-0 transition-all duration-500 hover:-translate-y-2">
        <CardContent className="p-0">
          {/* Header with gradient */}
          <div className="relative overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={subcategoryImage}
                alt={subcategory.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Overlay Content */}
            <div className="absolute right-4 bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold drop-shadow-lg">
                {subcategory.name}
              </h3>
            </div>

            {/* Parent Category Badge */}
            {showParentCategory && (
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className="bg-white/90 text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {categoryName}
                </Badge>
              </div>
            )}

            {/* Arrow Icon */}
            <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <ArrowRight className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {/* Parent Category */}
            {showParentCategory && (
              <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {categoryName}
              </div>
            )}

            {/* SubCategory Title */}
            <h3 className="line-clamp-1 text-lg font-bold text-gray-800 transition-colors group-hover:text-gray-900">
              {subcategory.name}
            </h3>

            {/* Description */}
            {showDescription && subcategory.description && (
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {subcategory.description}
              </p>
            )}

            {/* Action Button */}
            <Button
              className="text-primary border-primary/20 hover:bg-primary flex w-full items-center justify-center gap-2 rounded-full border bg-white transition-all duration-300 hover:text-white"
              onClick={handleViewSubCategory}
              data-subcategory-action="true"
            >
              Browse SubCategory
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
