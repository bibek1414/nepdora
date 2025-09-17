import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, TrendingUp } from "lucide-react";
import { Category } from "@/types/owner-site/admin/product";

interface CategoryCard2Props {
  category: Category;
  siteUser?: string;
  showDescription?: boolean;
  showProductCount?: boolean;
  onClick?: () => void;
}

export const CategoryCard2: React.FC<CategoryCard2Props> = ({
  category,
  siteUser,
  showDescription = true,
  showProductCount = true,
  onClick,
}) => {
  const categoryImage =
    category.image ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop";

  const getCategoryUrl = (): string => {
    if (siteUser) {
      return `/preview/${siteUser}/products?category=${category.slug}`;
    } else {
      return `/preview/products?category=${category.slug}`;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const categoryUrl = getCategoryUrl();
      window.location.href = categoryUrl;
    }
  };

  const categoryUrl = getCategoryUrl();

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={categoryUrl}>{children}</Link>
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
                src={categoryImage}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h3 className="mb-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                  {category.name}
                </h3>

                {showDescription && category.description && (
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                    {category.description}
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
