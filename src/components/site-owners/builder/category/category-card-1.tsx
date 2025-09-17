import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, Star, ArrowRight } from "lucide-react";
import { Category } from "@/types/owner-site/admin/product";
import { toast } from "sonner";

interface CategoryCard1Props {
  category: Category;
  siteUser?: string;
  showDescription?: boolean;
  showProductCount?: boolean;
  onClick?: () => void;
}

export const CategoryCard1: React.FC<CategoryCard1Props> = ({
  category,
  siteUser,
  showDescription = true,
  showProductCount = true,
  onClick,
}) => {
  // Use actual category data
  const categoryImage =
    category.image ||
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop";

  const handleViewCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const categoryUrl = getCategoryUrl();
    window.location.href = categoryUrl;
  };

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
      <Card className="group hover: overflow-hidden border-0 transition-all duration-500 hover:-translate-y-2">
        <CardContent className="p-0">
          {/* Header with gradient */}
          <div className="relative overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={categoryImage}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Overlay Content */}
            <div className="absolute right-4 bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold drop-shadow-lg">
                {category.name}
              </h3>
            </div>

            {/* Arrow Icon */}
            <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <ArrowRight className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {/* Category Title */}
            <h3 className="line-clamp-1 text-lg font-bold text-gray-800 transition-colors group-hover:text-gray-900">
              {category.name}
            </h3>

            {/* Description */}
            {showDescription && category.description && (
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {category.description}
              </p>
            )}

            {/* Action Button */}
            <Button
              className="text-primary border-primary/20 hover:bg-primary flex w-full items-center justify-center gap-2 rounded-full border bg-white transition-all duration-300 hover:text-white"
              onClick={handleViewCategory}
              data-category-action="true"
            >
              Browse Category
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
