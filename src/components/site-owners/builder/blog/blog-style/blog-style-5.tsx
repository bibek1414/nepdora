"use client";

import React from "react";
import { motion } from "framer-motion";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { BlogCard9 } from "../blog-card/blog-card9";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Rss } from "lucide-react";
import { hexToRgba } from "@/lib/utils";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface BlogStyle5Props {
  data: BlogComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BlogComponentData["data"]>) => void;
  onBlogClick?: (blogSlug: string) => void;
}

export const BlogStyle5: React.FC<BlogStyle5Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onBlogClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: { primary: "#059669", primaryForeground: "#ffffff" },
    fonts: { heading: "Inter", body: "Inter" },
  };

  const {
    title = "Read professionally written articles about Carehands",
    badge = "Latest news",
  } = data || {};

  const pageSize = 4;
  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useBlogs({
    page: 1,
    page_size: pageSize,
  });
  const blogs = blogsData?.results || [];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header - centered */}
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-5"
          >
            <div
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-gray-800"
              style={{ backgroundColor: hexToRgba(theme.colors.primary, 0.15) }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <EditableText
                value={badge}
                onChange={val => onUpdate?.({ badge: val })}
                as="span"
                isEditable={isEditable}
                placeholder="Latest news"
              />
            </div>

            <EditableText
              value={title}
              onChange={val => onUpdate?.({ title: val })}
              as="h2"
              className="max-w-2xl text-4xl leading-tight font-bold text-gray-900 md:text-5xl"
              style={{ fontFamily: theme.fonts.heading }}
              isEditable={isEditable}
              placeholder="Enter section title..."
              multiline
            />
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex h-[400px] flex-col space-y-3 rounded-3xl bg-white p-6 shadow-sm"
              >
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Blog Posts</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load blogs."}
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {!isLoading && !error && blogs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {blogs.slice(0, pageSize).map((blog, index) => (
              <div key={blog.id} className="relative">
                {isEditable && <div className="absolute inset-0 z-10" />}
                <BlogCard9
                  blog={blog}
                  siteUser={siteUser}
                  index={index}
                  onClick={() => onBlogClick?.(blog.slug)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State / Bottom Action */}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Rss}
            title="No Blog Posts Found"
            description="Share your insights and updates. Add blog posts from the admin dashboard."
            actionLabel="Add New Blog"
            actionLink="/admin/blogs"
            isEditable={isEditable}
            isEmpty={blogs.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
