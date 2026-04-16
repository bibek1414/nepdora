"use client";

import React, { useState } from "react";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { BlogCard1 } from "../blog-card/blog-card1";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Rss } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import Pagination from "@/components/ui/pagination";

interface BlogStyle7Props {
  data: BlogComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BlogComponentData["data"]>) => void;
  onBlogClick?: (blogSlug: string) => void;
}

/**
 * @beautifulMention: Blog Style 7
 * Paginated blog grid using the standard BlogCard1 design.
 * Features a clean responsive layout with integrated pagination.
 */
export const BlogStyle7: React.FC<BlogStyle7Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onBlogClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: { primary: "#000000", primaryForeground: "#ffffff" },
    fonts: { heading: "Inter", body: "Inter" },
  };

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const {
    title = "Latest Blog Posts",
    subtitle = "Stay updated with our newest articles and insights from our team of experts.",
  } = data || {};

  const { data: blogsData,
    isLoading,
    error, refetch } = useBlogs({
    page,
    page_size: pageSize,
  });

  const blogs = blogsData?.results || [];
  const totalCount = blogsData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="mx-auto max-w-2xl text-lg text-gray-500"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Blogs</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load blogs."}
            </AlertDescription>
          </Alert>
        )}

        {/* Content Section */}
        {!isLoading && !error && blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {blogs.map(blog => (
                <div key={blog.id} className="relative">
                  {isEditable && <div className="absolute inset-0 z-10" />}
                  <BlogCard1
                    blog={blog}
                    siteUser={siteUser}
                    onClick={() => {
                      if (onBlogClick) {
                        onBlogClick(blog.slug);
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State / Bottom Action */}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Rss}
            title="No Blog Posts Available"
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
