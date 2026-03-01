import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/owner-site/admin/product";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

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
  const pathname = usePathname();
  // Use actual category data
  const categoryImage =
    category.image ||
    "/fallback/image-not-found.png";

  const getCategoryUrl = (): string => {
    return generateLinkHref(
      `/collections?category=${category.slug}`,
      siteUser,
      pathname
    );
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
        <div className="bg-card-light dark:bg-card-dark relative mb-4 aspect-square overflow-hidden rounded-lg transition-transform hover:scale-105">
          <Image
            src={categoryImage}
            alt={category.name}
            height={400}
            width={400}
            className="object-cover"
          />
        </div>
        <h3 className="text-text-light dark:text-text-dark text-center text-lg font-semibold">
          {category.name}
        </h3>
      </div>
    </CardWrapper>
  );
};
