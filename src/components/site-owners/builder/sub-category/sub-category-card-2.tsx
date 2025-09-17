import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Tag } from "lucide-react";
import { SubCategory } from "@/types/owner-site/admin/product";

interface SubCategoryCard2Props {
  subcategory: SubCategory;
  siteUser?: string;
  showDescription?: boolean;
  showProductCount?: boolean;
  showParentCategory?: boolean;
  onClick?: () => void;
}

export const SubCategoryCard2: React.FC<SubCategoryCard2Props> = ({
  subcategory,
  siteUser,
  showDescription = true,
  showProductCount = true,
  showParentCategory = true,
  onClick,
}) => {
  const subcategoryImage =
    subcategory.image ||
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop";

  const getSubCategoryUrl = (): string => {
    if (siteUser) {
      return `/preview/${siteUser}/products?sub_category=${subcategory.slug}`;
    } else {
      return `/preview/products?sub_category=${subcategory.slug}`;
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

  // Handle category display (it could be object or string)
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
      <Card className="group overflow-hidden border transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="flex">
            {/* Image Section */}
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden">
              <Image
                src={subcategoryImage}
                alt={subcategory.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                {/* Parent Category */}
                {showParentCategory && (
                  <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                    <Tag className="h-3 w-3" />
                    {categoryName}
                  </div>
                )}

                <h3 className="mb-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                  {subcategory.name}
                </h3>

                {showDescription && subcategory.description && (
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                    {subcategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
