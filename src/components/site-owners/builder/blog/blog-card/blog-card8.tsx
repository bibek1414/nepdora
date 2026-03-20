import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { motion } from "framer-motion";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableLink } from "@/components/ui/editable-link";
import { ArrowUpRight } from "lucide-react";

interface BlogCard8Props {
  blog: BlogPost;
  siteUser?: string;
  onClick?: () => void;
  isEditable?: boolean;
}

export const BlogCard8: React.FC<BlogCard8Props> = ({
  blog,
  siteUser,
  onClick,
  isEditable = false,
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

  const ImageWrapper = siteUser
    ? ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <Link href={getDetailsUrl()} className={className}>
          {children}
        </Link>
      )
    : ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <a href={getDetailsUrl()} onClick={handleClick} className={className}>
          {children}
        </a>
      );

  return (
    <div className="flex h-full flex-col">
      <ImageWrapper className="block">
        <motion.div
          className="relative mb-4 h-44 overflow-hidden rounded-2xl sm:mb-6 sm:h-48"
          whileHover="hover"
          initial="rest"
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div 
            className="h-full w-full"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.02 }
            }}
          >
            <Image
              src={blogImage}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </motion.div>
        </motion.div>
      </ImageWrapper>
      
      <ImageWrapper className="block">
        <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors hover:text-primary">
          {blog.title}
        </h3>
      </ImageWrapper>
      
      <p className="mb-4 flex-1 line-clamp-3 text-sm text-gray-500">
        {blog.meta_description || "Read the full article for more insights."}
      </p>
      
      <div className="mt-auto pt-2">
        <motion.div 
          className="inline-flex items-center"
          whileHover="hover"
          initial="rest"
        >
          <motion.div
            variants={{
              rest: { x: 0 },
              hover: { x: 8 } // gap increase
            }}
            className="flex items-center gap-2"
          >
            <EditableLink
              text="Read More"
              href={getDetailsUrl()}
              isEditable={isEditable}
              onChange={() => {}} // Since "Read More" text is usually static across generated cards, changes won't persist here without passing onUpdate for each item's specific link details. Assuming standard EditableLink usage.
              className="p-0 font-bold text-gray-900 h-auto"
            />
            <div
              className="rounded-full p-1 text-white transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
