import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { formatDate } from "@/utils/date";

interface BlogCard3Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
  index?: number;
}

export const BlogCard3: React.FC<BlogCard3Props> = ({
  blog,
  siteUser,
  onClick,
  index = 0,
}) => {
  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1516251193007-4560f385c53b?w=800&h=450&fit=crop";

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

  return (
    <CardWrapper>
      <div
        className={`grid items-center gap-8 md:grid-cols-2 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
      >
        <div>
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            className="aspect-video h-auto w-full rounded-xl object-cover"
            width={800}
            height={450}
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {formatDate(blog.created_at)}
          </p>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            {blog.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            {blog.author && (
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <span>By {blog.author.username}</span>
              </div>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag.id}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <a
            className="mt-4 inline-block border-b-2 border-gray-900 pb-1 text-sm font-semibold tracking-wider text-gray-900 dark:border-white dark:text-white"
            href={getDetailsUrl()}
          >
            READ MORE
          </a>
        </div>
      </div>
    </CardWrapper>
  );
};
