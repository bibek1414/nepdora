import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { formatDate } from "@/utils/date";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface BlogCard5Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
}

export const BlogCard5: React.FC<BlogCard5Props> = ({
  blog,
  siteUser,
  onClick,
}) => {
  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=600&h=400&fit=crop";

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#013D2F",
      primary: "#84cc16",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/blogs/${blog.slug}`;
    } else {
      return `/blogs/${blog.slug}`;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={getDetailsUrl()}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  // Get author name
  const authorName = blog.author
    ? `${blog.author.first_name} ${blog.author.last_name}`.trim() ||
      blog.author.username
    : "Admin";

  // Extract excerpt from content (remove HTML tags and limit length)
  const getExcerpt = (content: string, maxLength: number = 100): string => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <CardWrapper>
      <div className="group">
        {/* Image */}
        <div className="relative mb-6 h-64 overflow-hidden rounded-3xl bg-gray-200">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Metadata */}
        <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(blog.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} />
            By {authorName}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 text-xl font-bold transition-colors group-hover:text-[#84cc16]">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-500">
          {getExcerpt(blog.content)}
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-sm font-bold transition-transform group-hover:translate-x-2">
          Read More <ArrowRight size={14} />
        </div>
      </div>
    </CardWrapper>
  );
};
