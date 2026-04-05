"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/date";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { generateLinkHref } from "@/lib/link-utils";

interface BlogCard9Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
  index?: number;
}

// Helper function to get author initials
const getAuthorInitials = (author: {
  first_name?: string;
  last_name?: string;
  username: string;
}): string => {
  if (author.first_name && author.last_name) {
    return `${author.first_name.charAt(0)}${author.last_name.charAt(0)}`.toUpperCase();
  }
  return author.username.charAt(0).toUpperCase();
};

export const BlogCard9: React.FC<BlogCard9Props> = ({
  blog,
  siteUser,
  onClick,
  index = 0,
}) => {
  const blogImage = blog.thumbnail_image || "/fallback/image-not-found.png";
  const pathname = usePathname();

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/blog-details-draft" : "/blog-details";
    return generateLinkHref(`${basePath}/${blog.slug}`, siteUser, pathname);
  };

  const handleClick = (e?: React.MouseEvent) => {
    if (onClick) {
      if (e) e.preventDefault();
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const authorName =
    blog.author && blog.author.first_name && blog.author.last_name
      ? `${blog.author.first_name} ${blog.author.last_name}`
      : blog.author?.username || "Unknown Author";

  const ContentLink = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link
          href={getDetailsUrl()}
          className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div
          onClick={handleClick}
          className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          {children}
        </div>
      );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <ContentLink>
        {/* Image - flush to top, no padding */}
        <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col px-7 py-6">
          {/* Date */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} strokeWidth={1.5} />
            <time>{formatDate(blog.created_at)}</time>
          </div>

          {/* Title */}
          <h3 className="mb-6 line-clamp-2 min-h-14 text-xl leading-snug font-bold text-gray-900">
            {blog.title}
          </h3>
        </div>
      </ContentLink>
    </motion.div>
  );
};
