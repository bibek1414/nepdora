import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, User, Tag } from "lucide-react";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { formatDate } from "@/utils/date";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
interface BlogCard2Props {
  blog: BlogPost;
  siteUser?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onClick?: () => void;
  variant?: "featured" | "standard";
}

export const BlogCard2: React.FC<BlogCard2Props> = ({
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
    "https://images.unsplash.com/photo-1507925921958-8186109cbb5a?w=600&h=400&fit=crop";

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/publish/${siteUser}/blogs/${blog.slug}`;
    } else {
      return `/blogs/${blog.slug}`;
    }
  };
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
      <article className="group transition-all duration-300 hover:-translate-y-1 hover:transform">
        {/* Image */}
        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div>
          {/* Tags */}
          {showTags && blog.tags && blog.tags.length > 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {blog.tags.slice(1, 4).map(tag => (
                <Badge
                  key={tag.id}
                  style={{
                    background: theme.colors.primary,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          {/* Meta information */}
          <div className="text-muted-foreground mb-3 flex items-center text-sm md:text-base">
            {showDate && (
              <>
                <span className="tracking-wider uppercase">
                  {formatDate(blog.created_at).toUpperCase()}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h2
            className="mb-4 text-xl leading-snug font-bold md:text-xl"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading,
            }}
          >
            {blog.title}
          </h2>

          {/* Additional meta */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
            {showAuthor && blog.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{blog.author.username}</span>
              </div>
            )}
            {showReadTime && blog.time_to_read && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{blog.time_to_read} min read</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </CardWrapper>
  );
};
