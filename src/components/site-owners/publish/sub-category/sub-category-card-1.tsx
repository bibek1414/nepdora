import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag } from "lucide-react";
import { SubCategory } from "@/types/owner-site/admin/product";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface SubCategoryCard1Props {
  subcategory: SubCategory;
  siteUser?: string;
  showDescription?: boolean;
  showProductCount?: boolean;
  showParentCategory?: boolean;
  onClick?: () => void;
}

// SubCategoryCard1 - Simple design matching CategoryCard1
export const SubCategoryCard1: React.FC<SubCategoryCard1Props> = ({
  subcategory,
  siteUser,
  showDescription = true,
  showParentCategory = true,
  onClick,
}) => {
  const subcategoryImage =
    subcategory.image ||
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

  const getSubCategoryUrl = (): string => {
    if (siteUser) {
      return `/publish/${siteUser}/products?sub_category=${subcategory.slug}`;
    } else {
      return `/publish/products?sub_category=${subcategory.slug}`;
    }
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

  // Handle category display
  const categoryName =
    typeof subcategory.category === "object" && subcategory.category
      ? subcategory.category.name
      : "Category";

  const CardWrapper = siteUser
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
      <div className="bg-background-light dark:bg-background-dark">
        {/* Parent Category Badge */}
        {showParentCategory && (
          <div className="mb-2 flex justify-center">
            <Badge variant="outline" className="text-xs">
              <Tag className="mr-1 h-3 w-3" />
              {categoryName}
            </Badge>
          </div>
        )}

        <div className="bg-card-light dark:bg-card-dark mb-4 flex h-64 items-center justify-center rounded-lg p-6 transition-transform hover:scale-105">
          <Image
            src={subcategoryImage}
            alt={subcategory.name}
            width={400}
            height={400}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <h3 className="text-text-light dark:text-text-dark mb-2 text-center text-lg font-semibold">
          {subcategory.name}
        </h3>

        {showDescription && subcategory.description && (
          <p className="text-muted-foreground mb-2 text-center text-sm">
            {subcategory.description}
          </p>
        )}
      </div>
    </CardWrapper>
  );
};

// SubCategoryCard3 - Premium design matching CategoryCard3
