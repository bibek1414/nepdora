"use client";
import React from "react";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { BlogCard6 } from "../blog-card/blog-card6";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Rss } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { BlogComponentData } from "@/types/owner-site/components/blog";

interface BlogStyleProps {
  data: BlogComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BlogComponentData["data"]>) => void;
  onBlogClick?: (blogSlug: string) => void;
}

export const BlogStyle6: React.FC<BlogStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onBlogClick,
}) => {
  const { title = "Latest Blog Posts", subtitle } = data || {};
  const pageSize = 6;
  const {
    data: blogsData,
    isLoading,
    error,
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

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header - shown only if not handled by card internally */}
        <div className="mb-8 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-2 text-3xl font-bold tracking-tight"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-2xl text-lg"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Blog Posts</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load blogs."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && blogs.length > 0 && (
          <div className="relative">
            {isEditable && (
              <div className="absolute inset-0 z-10 bg-transparent" />
            )}
            <BlogCard6
              blogs={blogs.slice(0, pageSize)}
              siteUser={siteUser}
              onPostClick={blog => onBlogClick?.(blog.slug)}
            />
          </div>
        )}

        {!isLoading && !error && blogs.length === 0 && (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <Rss className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No Blog Posts Found
            </h3>
            <p className="text-muted-foreground">
              Add some blog posts to display them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
