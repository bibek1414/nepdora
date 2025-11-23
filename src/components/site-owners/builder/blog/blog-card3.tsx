import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { formatDate } from "@/utils/date";

interface BlogCard3Props {
  blog: BlogPost;
  siteUser?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  onClick?: () => void;
  index?: number;
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

export const BlogCard3: React.FC<BlogCard3Props> = ({
  blog,
  siteUser,
  showAuthor = true,
  showDate = true,
  showTags = true,
  showReadTime = true,
  onClick,
  index = 0,
}) => {
  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1516251193007-4560f385c53b?w=800&h=450&fit=crop";

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
        <Link href={getDetailsUrl()} className="block">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  const excerpt = getExcerpt(blog);
  const firstTag = blog.tags && blog.tags.length > 0 ? blog.tags[0] : null;

  return (
    <CardWrapper>
      <article className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-center lg:gap-12">
        {/* Image */}
        <div className="md:w-1/3">
          <div className="relative aspect-[6/5] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={blogImage}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>

        {/* Content */}
        <div className="md:w-2/3">
          {/* Date and Category */}
          {showDate && (
            <div className="flex items-center gap-4 text-sm">
              <time className="text-gray-500 dark:text-gray-400">
                {formatDate(blog.created_at)}
              </time>
              {showTags && firstTag && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {firstTag.name}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            <a
              href={getDetailsUrl()}
              onClick={e => {
                if (!siteUser) {
                  e.preventDefault();
                  handleClick();
                }
              }}
              className="hover:underline"
            >
              {blog.title}
            </a>
          </h3>

          {/* Description */}
          {excerpt && (
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              {excerpt}
            </p>
          )}

          {/* Author Section */}
          {showAuthor && blog.author && (
            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                {blog.author.first_name || blog.author.last_name ? (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {getAuthorInitials(blog.author)}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {blog.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {blog.author.first_name && blog.author.last_name
                    ? `${blog.author.first_name} ${blog.author.last_name}`
                    : blog.author.username}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {blog.author.username}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
    </CardWrapper>
  );
};
