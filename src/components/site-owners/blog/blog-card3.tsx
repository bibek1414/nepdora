import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, User, Tag } from "lucide-react";
import { BlogPost } from "@/types/owner-site/blog";
import { formatDate } from "@/utils/date";

interface BlogCard3Props {
  blog: BlogPost;
  siteId?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onClick?: () => void;
}

export const BlogCard3: React.FC<BlogCard3Props> = ({
  blog,
  siteId,
  showAuthor = true,
  showDate = true,
  showTags = true,
  showReadTime = true,
  onClick,
}) => {
  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1516251193007-4560f385c53b?w=200&h=150&fit=crop";

  const getDetailsUrl = (): string => {
    if (siteId) {
      return `/preview/${siteId}/blogs/${blog.slug}`;
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

  const CardWrapper = siteId
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
      <div className="bg-card flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-32">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          {showTags && blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 2).map(tag => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <h3 className="text-foreground line-clamp-2 text-base font-semibold">
            {blog.title}
          </h3>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {showAuthor && blog.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{blog.author.username}</span>
              </div>
            )}
            {showDate && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <span>{formatDate(blog.created_at)}</span>
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
      </div>
    </CardWrapper>
  );
};
