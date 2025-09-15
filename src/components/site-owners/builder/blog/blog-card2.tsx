import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, User, Tag } from "lucide-react";
import { BlogPost } from "@/types/owner-site/blog";
import { formatDate } from "@/utils/date";

interface BlogCard2Props {
  blog: BlogPost;
  siteUser?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onClick?: () => void;
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
      return `/preview/${siteUser}/blogs/${blog.slug}`;
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
      <Card className="group hover: overflow-hidden rounded-lg border-0 transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={blogImage}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="line-clamp-2 text-xl font-bold text-white">
                {blog.title}
              </h3>
            </div>
          </div>
          <div className="bg-muted/20 p-4">
            {showTags && blog.tags && blog.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="bg-white/80 text-xs font-medium backdrop-blur-sm"
                  >
                    <Tag className="text-primary mr-1 h-3 w-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
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
