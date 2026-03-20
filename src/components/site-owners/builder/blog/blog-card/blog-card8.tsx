import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { motion } from "framer-motion";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface BlogCard8Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
}

export const BlogCard8: React.FC<BlogCard8Props> = ({
  blog,
  siteUser,
  onClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const primaryColor = theme?.colors?.primary || "#4f46e5";

  const pathname = usePathname();

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/blog-details-draft" : "/blog-details";
    return generateLinkHref(`${basePath}/${blog.slug}`, siteUser, pathname);
  };

  const handleClick = (e?: React.MouseEvent) => {
    if (onClick) {
      e?.preventDefault();
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const blogImage =
    blog.thumbnail_image ||
    "/fallback/image-not-found.png";

  const ContentWrapper = siteUser
    ? ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => (
        <Link href={getDetailsUrl()} className={className}>
          {children}
        </Link>
      )
    : ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => (
        <a href={getDetailsUrl()} onClick={handleClick} className={className}>
          {children}
        </a>
      );

  return (
    <ContentWrapper className="group block h-full cursor-pointer">
      <motion.div
        className="relative mb-4 h-44 overflow-hidden rounded-2xl sm:mb-6 sm:h-48"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Image
          src={blogImage}
          alt={blog.thumbnail_image_alt_description || blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </motion.div>
      <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors">
        {blog.title}
      </h3>
      <p className="mb-4 line-clamp-3 text-sm text-gray-500">
        {blog.meta_description || "Read the full article for more insights."}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-2 text-sm font-bold text-gray-900 transition-all group-hover:gap-4">
        Read More{" "}
        <div
          className="rounded-full p-1 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </div>
    </ContentWrapper>
  );
};
