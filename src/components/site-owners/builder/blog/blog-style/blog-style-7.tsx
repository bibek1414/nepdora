"use client";
import React from "react";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { BlogCard7 } from "../blog-card/blog-card7";
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

export const BlogStyle7: React.FC<BlogStyleProps> = ({
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-[180px] w-full rounded-xl" />
              <Skeleton className="h-[180px] w-full rounded-xl" />
            </div>
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
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
            {/* Left Column - Featured Post */}
            {blogs[0] && (
              <div className="relative transform cursor-default transition-transform duration-200 hover:scale-[1.02]">
                {isEditable && (
                  <div className="absolute inset-0 z-10 bg-transparent" />
                )}
                <BlogCard7
                  blog={blogs[0]}
                  siteUser={siteUser}
                  onClick={() => onBlogClick?.(blogs[0].slug)}
                  isFeatured={true}
                />
              </div>
            )}

            {/* Right Column - List of Posts */}
            <div className="flex flex-col gap-10">
              {blogs[1] && (
                <div className="relative h-full cursor-default transition-transform duration-200 hover:scale-[1.02]">
                  {isEditable && (
                    <div className="absolute inset-0 z-10 bg-transparent" />
                  )}
                  <BlogCard7
                    blog={blogs[1]}
                    siteUser={siteUser}
                    onClick={() => onBlogClick?.(blogs[1].slug)}
                    isFeatured={false}
                  />
                </div>
              )}
              {blogs[2] && (
                <div className="relative h-full cursor-default border-t border-gray-100 pt-10 transition-transform duration-200 hover:scale-[1.02] lg:border-t-0 lg:pt-0">
                  {isEditable && (
                    <div className="absolute inset-0 z-10 bg-transparent" />
                  )}
                  <BlogCard7
                    blog={blogs[2]}
                    siteUser={siteUser}
                    onClick={() => onBlogClick?.(blogs[2].slug)}
                    isFeatured={false}
                  />
                </div>
              )}
            </div>
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
