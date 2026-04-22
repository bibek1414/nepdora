import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SubCategory } from "@/types/owner-site/admin/product";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

interface SubCategoryCard1Props {
  subcategory: SubCategory;
  siteUser?: string;
  onClick?: () => void;
}

export const SubCategoryCard1: React.FC<SubCategoryCard1Props> = ({
  subcategory,
  siteUser,
  onClick,
}) => {
  const pathname = usePathname();
  const subcategoryImage = subcategory.image || "/fallback/image-not-found.png";

  const getSubCategoryUrl = (): string => {
    return generateLinkHref(
      `/collections?sub_category=${subcategory.slug}`,
      siteUser,
      pathname
    );
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
        <div className="bg-card-light dark:bg-card-dark relative mb-4 aspect-square overflow-hidden rounded-lg transition-transform hover:scale-105">
          <Image
            unoptimized
            src={subcategoryImage}
            alt={subcategory.name}
            height={400}
            width={400}
            className="object-cover"
          />
        </div>
        <h3 className="text-text-light dark:text-text-dark text-center text-lg font-semibold">
          {subcategory.name}
        </h3>
      </div>
    </CardWrapper>
  );
};
