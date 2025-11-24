import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { formatDate } from "@/utils/date";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Button } from "@/components/ui/button";

interface BlogCard4Props {
  blog: BlogPost;
  siteUser?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onClick?: () => void;
}

export const BlogCard4: React.FC<BlogCard4Props> = ({
  blog,
  siteUser,
  showAuthor = true,
  showDate = true,
  showTags = true,
  showReadTime = true,
  onClick,
}) => {
  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=600&h=400&fit=crop";

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
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
      return `/publish/${siteUser}/blogs/${blog.slug}`;
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

  return (
    <CardWrapper>
      <div className="flex gap-6 rounded-lg bg-gray-100 p-8 dark:bg-zinc-800">
        {/* Image */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {/* Date with Calendar Icon */}
            {showDate && (
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar
                  className="h-5 w-5"
                  style={{
                    color: theme.colors.primary || "#2563EB",
                  }}
                />
                <span>{formatDate(blog.created_at)}</span>
              </div>
            )}

            {/* Title */}
            <h2
              className="mb-4 text-xl font-bold"
              style={{
                color: theme.colors.text || "#1E3A8A",
                fontFamily: theme.fonts.heading,
              }}
            >
              {blog.title}
            </h2>
          </div>

          {/* Read More Button */}
          <div>
            <Button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleClick();
              }}
              style={{
                backgroundColor: theme.colors.primary || "#2563EB",
                color: theme.colors.primaryForeground || "#FFFFFF",
                fontFamily: theme.fonts.body,
              }}
              className="rounded px-6 py-2 font-semibold hover:opacity-90"
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
