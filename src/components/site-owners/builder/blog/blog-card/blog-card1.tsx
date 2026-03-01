import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

interface BlogCard1Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
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
const getExcerpt = (blog: BlogPost, maxLength: number = 120): string => {
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

export const BlogCard1: React.FC<BlogCard1Props> = ({
  blog,
  siteUser,
  onClick,
}) => {
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

  const excerpt = getExcerpt(blog);
  const firstTag = blog.tags && blog.tags.length > 0 ? blog.tags[0] : null;

  const ContentLink = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={getDetailsUrl()} className="mt-4 block">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <a
          href={getDetailsUrl()}
          onClick={e => {
            e.preventDefault();
            handleClick();
          }}
          className="mt-4 block"
        >
          {children}
        </a>
      );

  return (
    <article className="flex flex-col">
      {/* Image */}
      <div className="flex-shrink-0">
        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between pt-6">
        <div className="flex-1">
          {/* Date and Category */}
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <time>{formatDate(blog.created_at)}</time>
            {firstTag && <span className="px-2">·</span>}
            {firstTag && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {firstTag.name}
              </span>
            )}
          </div>

          {/* Title and Description */}
          <ContentLink>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              {blog.title}
            </p>
            {excerpt && (
              <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
                {excerpt}
              </p>
            )}
          </ContentLink>
        </div>

        {/* Author Section */}
        {blog.author && (
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              <span className="sr-only">
                {blog.author.first_name && blog.author.last_name
                  ? `${blog.author.first_name} ${blog.author.last_name}`
                  : blog.author.username}
              </span>
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                {blog.author.first_name || blog.author.last_name ? (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {getAuthorInitials(blog.author)}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {blog.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {blog.author.first_name && blog.author.last_name
                  ? `${blog.author.first_name} ${blog.author.last_name}`
                  : blog.author.username}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {blog.author.username}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
