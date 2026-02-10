"use client";
import React from "react";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { BlogCard4 } from "../blog-card/blog-card4";
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

export const BlogStyle4: React.FC<BlogStyleProps> = ({
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {blogs.slice(0, pageSize).map(blog => (
              <div
                key={blog.id}
                className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
              >
                {isEditable && <div className="absolute inset-0 z-10" />}
                <BlogCard4
                  blog={blog}
                  siteUser={siteUser}
                  onClick={() => onBlogClick?.(blog.slug)}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && blogs.length === 0 && (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <Rss className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No Blog Posts Found
            </h3>
            <p className="text-muted-foreground">
              Add some blog posts to your site to display them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
