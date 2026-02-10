import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { formatDate } from "@/utils/date";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";

interface BlogCard2Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
  variant?: "featured" | "standard";
}

// Helper function to get author initials or first letter
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

export const BlogCard2: React.FC<BlogCard2Props> = ({
  blog,
  siteUser,
  onClick,
  variant = "standard",
}) => {
  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1507925921958-8186109cbb5a?w=600&h=400&fit=crop";

  const pathname = usePathname();

  const getDetailsUrl = (): string => {
    if (siteUser) {
      if (pathname?.includes("/preview/")) {
        return `/preview/${siteUser}/blogs/${blog.slug}`;
      }
      if (pathname?.includes("/publish/")) {
        return `/blogs/${blog.slug}`;
      }
      return `/blogs/${blog.slug}`;
    }
    return `/blogs/${blog.slug}`;
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
        <Link href={getDetailsUrl()} className="block h-full">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="h-full cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <article className="group relative flex h-full flex-col items-start justify-between overflow-hidden">
        <div className="relative w-full">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 sm:aspect-3/4 lg:aspect-square dark:bg-gray-800">
            <Image
              src={blogImage}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Ring border */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10"></div>

          {/* Gradient overlay from bottom */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-t from-gray-900/80 to-transparent"></div>

          {/* Text overlay at bottom */}
          <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
            {/* Date and Author row */}
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={blog.created_at}>
                {formatDate(blog.created_at)}
              </time>
              {blog.author && (
                <div className="flex items-center gap-x-2">
                  <div
                    className="bg-gray-5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${theme.colors.primary}20`,
                      color: theme.colors.primaryForeground || "#FFFFFF",
                      fontFamily: theme.fonts.heading,
                    }}
                  >
                    {getAuthorInitials(blog.author)}
                  </div>
                  <span
                    style={{
                      fontFamily: theme.fonts.body,
                    }}
                  >
                    {blog.author.first_name && blog.author.last_name
                      ? `${blog.author.first_name} ${blog.author.last_name}`
                      : blog.author.username}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3
              className="mt-3 text-lg leading-6 font-semibold"
              style={{
                fontFamily: theme.fonts.heading,
              }}
            >
              <a
                href={getDetailsUrl()}
                onClick={e => {
                  if (!siteUser) {
                    e.preventDefault();
                    handleClick();
                  }
                }}
                className="relative"
              >
                <span className="absolute inset-0"></span>
                {blog.title}
              </a>
            </h3>
          </div>
        </div>
      </article>
    </CardWrapper>
  );
};
