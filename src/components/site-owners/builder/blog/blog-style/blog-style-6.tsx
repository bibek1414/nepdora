"use client";

import React from "react";
import { AlertCircle, Rss } from "lucide-react";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditableText } from "@/components/ui/editable-text";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

import { BlogFeaturedCard6 } from "../blog-card/blog-featured-card-6";
import { BlogListItem6 } from "../blog-card/blog-list-item-6";

interface BlogStyle6Props {
  data: BlogComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BlogComponentData["data"]>) => void;
  onBlogClick?: (blogSlug: string) => void;
}

/**
 * @beautifulMention: Blog Style 6
 * Featured blog on the left, next 3 blogs in a list on the right.
 * Premium editorial layout with custom hover states managed via React state.
 */
export const BlogStyle6: React.FC<BlogStyle6Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onBlogClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: { primary: "#ff6b4a", primaryForeground: "#ffffff" },
    fonts: { heading: "Inter", body: "Inter" },
  };

  const {
    title = "Read our latest articles",
    subtitle = "Lorem ipsum dolor sit amet consectetur faucibus nunc habitasse aliquam vestibulum auctor fringilla risus consequat est semper.",
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

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const featuredBlog = blogs[0];
  const listBlogs = blogs.slice(1, 4);

  return (
    <section className="overflow-hidden bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="mb-4 text-4xl font-medium tracking-tight text-gray-950 md:text-6xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="mx-auto max-w-2xl text-lg text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <Skeleton className="aspect-4/3 w-full rounded-[2.5rem]" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
            <div className="space-y-12">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="space-y-4 border-b border-gray-100 pb-8"
                >
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </div>
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

        {/* Content Section */}
        {!isLoading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Featured Article */}
            {featuredBlog && (
              <BlogFeaturedCard6
                blog={featuredBlog}
                theme={theme}
                siteUser={siteUser}
                onClick={onBlogClick}
                isEditable={isEditable}
              />
            )}

            {/* Article List */}
            <div className="space-y-12">
              {listBlogs.map((blog, index) => (
                <BlogListItem6
                  key={blog.id}
                  blog={blog}
                  theme={theme}
                  index={index}
                  onClick={onBlogClick}
                  isEditable={isEditable}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Bottom Action */}
        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Rss}
            title="No Articles Found"
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
