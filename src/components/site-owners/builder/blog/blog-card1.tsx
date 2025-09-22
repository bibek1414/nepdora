import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/date";
import { BlogPost } from "@/types/owner-site/admin/blog";

interface BlogCard1Props {
  blog: BlogPost;
  siteUser?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onClick?: () => void;
}

export const BlogCard1: React.FC<BlogCard1Props> = ({
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
      <div className="bg-background-light h-full overflow-hidden rounded-lg shadow-md dark:bg-zinc-800">
        <div className="relative h-56 w-full">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
            {blog.title}
          </h2>

          <div className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            {showDate && (
              <span className="mr-3">{formatDate(blog.created_at)}</span>
            )}
            {showAuthor && blog.author && (
              <span className="mr-3">{blog.author.username}</span>
            )}
            {showReadTime && blog.time_to_read && (
              <span>{blog.time_to_read} min read</span>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
