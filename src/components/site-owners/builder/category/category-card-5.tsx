// components/category-card-5.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/owner-site/admin/product";

interface CategoryCard5Props {
  category: Category;
  siteUser?: string;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard5: React.FC<CategoryCard5Props> = ({
  category,
  siteUser,
  onClick,
  className = "",
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
        <Link href={categoryUrl} className={`block ${className}`}>
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className={`cursor-pointer ${className}`}>
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <div className="group flex items-center justify-between border-r border-b border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-medium text-black transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {category.name}
        </h3>
        <div className="relative h-20 w-20">
          <Image
            src={categoryImage}
            alt={category.name}
            fill
            className="object-contain transition-transform duration-200 group-hover:scale-110"
            sizes="80px"
          />
        </div>
      </div>
    </CardWrapper>
  );
};
