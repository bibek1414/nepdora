"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/owner-site/admin/product";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface CategoryCard8Props {
  category: Category;
  stepNumber?: number;
  siteUser?: string;
  isEditable?: boolean;
  onClick?: (categoryId: number) => void;
}

export const CategoryCard8: React.FC<CategoryCard8Props> = ({
  category,
  stepNumber,
  siteUser,
  isEditable = false,
  onClick,
}) => {
  const pathname = usePathname();
  const categoryImage = category.image || "/fallback/image-not-found.png";

  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
      accent: "#3B82F6",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const colors = theme.colors as any;
  const fonts = theme.fonts;

  function getCategoryUrl(): string {
    return generateLinkHref(
      `/collections?category=${category.slug}`,
      siteUser,
      pathname
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(category.id);
    }
  };

  const categoryUrl = getCategoryUrl();

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative flex w-full cursor-pointer items-center gap-5 overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-5 backdrop-blur-md transition-all duration-300"
      onClick={handleClick}
    >
      {/* Step Indicator */}

      {/* Image Container */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/40 transition-transform duration-500 group-hover:rotate-3">
        <Image unoptimized
          src={categoryImage}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-115"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Text Content */}
      <div className="flex-1 space-y-1.5">
        <h3
          className="text-foreground/90 group-hover:text-foreground text-xl font-bold tracking-tight"
          style={{ fontFamily: fonts.heading }}
        >
          {category.name}
        </h3>
        <p
          className="line-clamp-1 text-sm leading-relaxed opacity-80 group-hover:opacity-100"
          style={{ fontFamily: fonts.body }}
        >
          {category.description || "Discover personalized selections."}
        </p>
      </div>

      {/* Icon */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/50 transition-all dark:bg-white/5"
        style={{
          backgroundColor: isEditable ? undefined : `${colors.primary}10`,
        }}
      >
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </div>

      {/* Decorative Glow */}
      <div
        className="absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: colors.primary, opacity: 0.1 }}
      />
    </motion.div>
  );

  if (isEditable) {
    return <div className="mb-5 last:mb-0">{content}</div>;
  }

  return (
    <Link
      href={categoryUrl}
      className="mb-5 block no-underline last:mb-0"
      onClick={handleClick}
    >
      {content}
    </Link>
  );
};
