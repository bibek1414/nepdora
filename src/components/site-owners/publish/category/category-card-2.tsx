import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/owner-site/admin/product";

interface CategoryCard2Props {
  category: Category;
  siteUser?: string;
  onClick?: () => void;
}

export const CategoryCard2: React.FC<CategoryCard2Props> = ({
  category,
  siteUser,
  onClick,
}) => {
  const categoryImage =
    category.image ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop";

  const getCategoryUrl = (): string => {
    if (siteUser) {
      return `/collections?category=${category.slug}`;
    } else {
      return `/publish/collections?category=${category.slug}`;
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
      <div className="group relative h-80 cursor-pointer overflow-hidden rounded-xl shadow-lg">
        <Image
          src={categoryImage}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-3xl font-bold md:text-4xl">{category.name}</h2>
          <a className="mt-2 inline-flex items-center rounded-full bg-black/70 px-4 py-2 text-base font-semibold transition-colors hover:bg-black md:text-lg">
            SHOP NOW <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </CardWrapper>
  );
};
