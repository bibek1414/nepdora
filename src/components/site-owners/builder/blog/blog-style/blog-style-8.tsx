"use client";
import React from "react";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { BlogCard8 } from "../blog-card/blog-card8";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Rss, ArrowUpRight } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateLinkHref } from "@/lib/link-utils";
import { usePathname } from "next/navigation";

interface BlogStyleProps {
  data: BlogComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BlogComponentData["data"]>) => void;
  onBlogClick?: (blogSlug: string) => void;
}

export const BlogStyle8: React.FC<BlogStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onBlogClick,
}) => {
  const { title = "Strategic Insights That Drive Business Success" } =
    data || {};

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const primaryColor = theme?.colors?.primary || "#4f46e5";

  const pageSize = 4;
  const {
    data: blogsData,
    isLoading,
    error,
  } = useBlogs({
    page: 1,
    page_size: pageSize,
  });
  const featuredBlogs = blogsData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const pathname = usePathname();

  const getBlogsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/blogs-draft" : "/blogs";
    return generateLinkHref(basePath, siteUser, pathname);
  };

  return (
    <section id="blog" className="bg-gray-50/50 py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div
          className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end md:gap-0"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-0 max-w-xl text-3xl font-bold tracking-tight md:text-4xl"
            isEditable={isEditable}
            placeholder="Enter title..."
          />

          <div className="flex items-center gap-5!">
            <EditableLink
              text="View More Blogs"
              href={getBlogsUrl()}
              isEditable={isEditable}
              onChange={() => {}}
              style={{
                backgroundColor: primaryColor,
                color: "#FFFFFF",
              }}
              className="mr-2! w-48! px-2! font-bold text-gray-900"
            >
              View More Blogs
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </div>
            </EditableLink>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Blog Posts</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load blogs."}
            </AlertDescription>
          </Alert>
        ) : featuredBlogs.length === 0 ? (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <Rss className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No Blog Posts Found
            </h3>
            <p className="text-muted-foreground">
              Add some blog posts to your site to display them here.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {featuredBlogs.map(blog => (
              <div
                key={blog.slug}
                className="relative z-10 transition-transform duration-200"
              >
                {isEditable && (
                  <div className="absolute inset-0 z-20 bg-transparent" />
                )}
                <BlogCard8
                  blog={blog}
                  siteUser={siteUser}
                  onClick={() => onBlogClick?.(blog.slug)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
