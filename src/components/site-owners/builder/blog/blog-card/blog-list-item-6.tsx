"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import { BlogPost } from "@/types/owner-site/admin/blog";

interface BlogListItem6Props {
  blog: BlogPost;
  theme: any;
  index?: number;
  onClick?: (slug: string) => void;
  isEditable?: boolean;
}

export const BlogListItem6: React.FC<BlogListItem6Props> = ({
  blog,
  theme,
  index = 0,
  onClick,
  isEditable,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex cursor-pointer items-start justify-between border-b border-gray-100 pb-8"
      onClick={handleCardClick}
    >
      {/* Overlay for builder interactions */}
      {isEditable && <div className="absolute inset-0 z-10" />}

      <div className="max-w-md">
        <h3
          className="mb-2 text-2xl leading-tight font-medium transition-colors duration-300"
          style={{
            fontFamily: theme.fonts.heading,
          }}
        >
          {blog.title}
        </h3>
        <p
          className="mb-4 line-clamp-2 text-sm text-gray-500"
          style={{ fontFamily: theme.fonts.body }}
        >
          {blog.meta_description ||
            "Read more about this article to stay informed and inspired."}
        </p>
      </div>

      {/* Small Icon Transition */}
      <div
        className="relative ml-4 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-all duration-300"
        style={{
          backgroundColor: isHovered ? theme.colors.primary : "#f9fafb",
        }}
      >
        <Plus
          className="absolute h-5 w-5 transition-all duration-300"
          style={{
            opacity: isHovered ? 0 : 1,
            transform: isHovered
              ? "scale(0) rotate(90deg)"
              : "scale(1) rotate(0deg)",
            color: "#030712",
          }}
        />
        <ChevronRight
          className="absolute h-5 w-5 transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered
              ? "scale(1) rotate(0deg)"
              : "scale(0) rotate(-90deg)",
            color: theme.colors.primaryForeground || "#ffffff",
          }}
        />
      </div>
    </motion.div>
  );
};
