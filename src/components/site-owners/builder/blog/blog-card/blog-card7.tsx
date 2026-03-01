import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { Calendar, User, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

interface BlogCard7Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
  isFeatured?: boolean;
}

// Helper function to strip HTML and get plain text
const stripHtml = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Helper function to get excerpt from content or meta description
const getExcerpt = (blog: BlogPost, maxLength: number = 150): string => {
  const text = blog.meta_description
    ? stripHtml(blog.meta_description)
    : blog.content
      ? stripHtml(blog.content)
      : "";

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

// Helper function to get author name
const getAuthorName = (author: {
  first_name?: string;
  last_name?: string;
  username: string;
}): string => {
  if (author.first_name && author.last_name) {
    return `${author.first_name} ${author.last_name}`;
  }
  return author.username;
};

export const BlogCard7: React.FC<BlogCard7Props> = ({
  blog,
  siteUser,
  onClick,
  isFeatured = false,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const accentColor = theme?.colors?.primary || "#84cc16";

  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=600&h=400&fit=crop";

  const pathname = usePathname();

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/blog-details-draft" : "/blog-details";
    return generateLinkHref(`${basePath}/${blog.slug}`, siteUser, pathname);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const excerpt = getExcerpt(blog, isFeatured ? 180 : 120);
  const authorName = blog.author ? getAuthorName(blog.author) : "Anonymous";

  const ContentWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={getDetailsUrl()}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <a
          href={getDetailsUrl()}
          onClick={e => {
            e.preventDefault();
            handleClick();
          }}
        >
          {children}
        </a>
      );

  if (isFeatured) {
    return (
      <ContentWrapper>
        <Card className="group h-full cursor-pointer overflow-hidden border-0 bg-white">
          {/* Image Container - Smaller to match right side */}
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-200 sm:h-72">
            <Image
              src={blogImage}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <CardContent className="flex grow flex-col p-0 pt-6">
            {/* Meta Information */}
            <div className="mb-3 flex items-center gap-6">
              <Badge
                variant="outline"
                className="gap-2 border-none bg-transparent px-0 text-gray-500 hover:bg-transparent"
              >
                <Calendar size={16} style={{ color: accentColor }} />
                <span className="text-sm">{formatDate(blog.created_at)}</span>
              </Badge>
              {blog.author && (
                <Badge
                  variant="outline"
                  className="gap-2 border-none bg-transparent px-0 text-gray-500 hover:bg-transparent"
                >
                  <User size={16} style={{ color: accentColor }} />
                  <span className="text-sm">By {authorName}</span>
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-3 text-2xl leading-tight font-bold text-gray-900">
              {blog.title}
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="mb-4 line-clamp-2 leading-relaxed text-gray-500">
                {excerpt}
              </p>
            )}

            {/* Read More Button */}
            <button className="mt-auto cursor-pointer pt-2">
              <div
                className="flex items-center gap-2 font-bold"
                style={{ color: accentColor }}
              >
                Read More <ChevronRight size={18} />
              </div>
            </button>
          </CardContent>
        </Card>
      </ContentWrapper>
    );
  }

  // Standard / Horizontal Card (Right Column Items)
  return (
    <ContentWrapper>
      <Card className="group h-full cursor-pointer overflow-hidden border-0 bg-white">
        <div className="flex h-full flex-col gap-6 sm:flex-row">
          {/* Image */}
          <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-200 sm:h-auto sm:w-5/12">
            <Image
              src={blogImage}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Content */}
          <CardContent className="flex flex-col justify-center p-0 py-2">
            {/* Meta Information */}
            <div className="mb-2 flex items-center gap-4">
              <Badge
                variant="outline"
                className="gap-1.5 border-none bg-transparent px-0 text-gray-500"
              >
                <Calendar size={14} style={{ color: accentColor }} />
                <span className="text-xs">{formatDate(blog.created_at)}</span>
              </Badge>
              {blog.author && (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-none bg-transparent px-0 text-gray-500"
                >
                  <User size={14} style={{ color: accentColor }} />
                  <span className="text-xs">By {authorName}</span>
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-2 text-lg leading-snug font-bold text-gray-900">
              {blog.title}
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                {excerpt}
              </p>
            )}

            {/* Read More Button */}
            <button className="mt-auto cursor-pointer">
              <div
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: accentColor }}
              >
                Read More <ChevronRight size={16} />
              </div>
            </button>
          </CardContent>
        </div>
      </Card>
    </ContentWrapper>
  );
};
