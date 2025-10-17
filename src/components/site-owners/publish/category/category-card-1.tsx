import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Category } from "@/types/owner-site/admin/product";

interface CategoryCard1Props {
  category: Category;
  siteUser?: string;
  onClick?: () => void;
}

export const CategoryCard1: React.FC<CategoryCard1Props> = ({
  category,
  siteUser,
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
      return `/products?category=${category.slug}`;
    } else {
      return `/publish/products?category=${category.slug}`;
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
      <div className="bg-background-light dark:bg-background-dark">
        <div className="bg-card-light dark:bg-card-dark mb-4 flex h-64 items-center justify-center rounded-lg p-6 transition-transform hover:scale-105">
          <Image
            src={categoryImage}
            alt={category.name}
            width={400}
            height={400}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <h3 className="text-text-light dark:text-text-dark text-center text-lg font-semibold">
          {category.name}
        </h3>
      </div>
    </CardWrapper>
  );
};
