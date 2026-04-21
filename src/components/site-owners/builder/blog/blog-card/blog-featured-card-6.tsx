"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { usePathname } from "next/navigation";

interface BlogFeaturedCard6Props {
  blog: BlogPost;
  theme: any;
  siteUser?: string;
  onClick?: (slug: string) => void;
  isEditable?: boolean;
}

export const BlogFeaturedCard6: React.FC<BlogFeaturedCard6Props> = ({
  blog,
  theme,
  siteUser,
  onClick,
  isEditable,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const handleCardClick = (e: React.MouseEvent) => {
    if (isEditable) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      e.preventDefault();
      onClick(blog.slug);
    }
  };

  const blogImage = blog.thumbnail_image || "/fallback/image-not-found.png";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Overlay for builder interactions */}
      {isEditable && <div className="absolute inset-0 z-10" />}

      <div className="relative mb-8 aspect-4/3 overflow-hidden rounded-[2.5rem]">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full"
        >
          <Image unoptimized
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <h3
          className="max-w-md text-3xl leading-tight font-medium transition-colors duration-300 md:text-4xl"
          style={{
            fontFamily: theme.fonts.heading,
          }}
        >
          {blog.title}
        </h3>

        {/* Premium Icon Transition */}
        <div
          className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-200 transition-all duration-300"
          style={{
            backgroundColor: isHovered ? theme.colors.primary : "transparent",
            borderColor: isHovered ? theme.colors.primary : "#e5e7eb",
          }}
        >
          <Plus
            className="absolute h-6 w-6 transition-all duration-300"
            style={{
              opacity: isHovered ? 0 : 1,
              transform: isHovered
                ? "scale(0) rotate(90deg)"
                : "scale(1) rotate(0deg)",
              color: "#030712",
            }}
          />
          <ChevronRight
            className="absolute h-6 w-6 transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered
                ? "scale(1) rotate(0deg)"
                : "scale(0) rotate(-90deg)",
              color: theme.colors.primaryForeground || "#ffffff",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
