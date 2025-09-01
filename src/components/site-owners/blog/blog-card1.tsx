import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, User, Tag } from "lucide-react";
import { BlogPost } from "@/types/owner-site/blog";
import { formatDate } from "@/utils/date";

interface BlogCard1Props {
  blog: BlogPost;
  siteId?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onClick?: () => void;
}

export const BlogCard1: React.FC<BlogCard1Props> = ({
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
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=600&h=400&fit=crop";

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
      <Card className="group overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={blogImage}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="space-y-3 p-4">
            {showTags && blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg font-bold transition-colors">
              {blog.title}
            </h3>
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
              {showAuthor && blog.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{blog.author.username}</span>
                </div>
              )}
              {showDate && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
              )}
              {showReadTime && blog.time_to_read && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{blog.time_to_read} min read</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
