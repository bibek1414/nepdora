"use client";

import React from "react";
import { useBlog } from "@/hooks/owner-site/admin/use-blogs";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { FileText } from "lucide-react";

interface BlogDetailProps {
  slug: string;
  siteUser?: string;
  isEditable?: boolean;
}

export const BlogDetail4: React.FC<BlogDetailProps> = ({
  slug,
  siteUser,
  isEditable = false,
}) => {
  const { data: blog, isLoading, error } = useBlog(slug);
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-6 py-24">
        <Skeleton className="mx-auto mb-12 h-12 w-3/4" />
        <Skeleton className="mb-16 aspect-video w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-background py-0 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-24">
          <BuilderEmptyState
            icon={FileText}
            title="Blog Post Not Found"
            description="We couldn't find the blog post you're looking for. It may have been deleted or the link is incorrect."
            actionLabel="Go to Admin Dashboard"
            actionLink="/admin/blogs"
            isEditable={isEditable}
            isEmpty={!isLoading && !blog}
          />
          {!isEditable && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error?.message || "Could not load blog post details."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    );
  }

  return (
    <article className="bg-background pb-20">
      {/* Header */}
      <header className="container mx-auto max-w-4xl px-6 pt-10 pb-10 text-center md:pt-24 md:pb-16">
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-6 duration-700">
          <div className="text-muted-foreground flex items-center gap-4 text-sm font-medium tracking-widest uppercase">
            <span>{formatDate(blog.created_at)}</span>
            <span className="bg-border h-1 w-1 rounded-full" />
            <span>{blog.tags?.[0]?.name || "Uncategorized"}</span>
          </div>
          <h1
            className="text-2xl leading-[1.1] font-normal tracking-tight sm:text-3xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          >
            {blog.title}
          </h1>
        </div>
      </header>

      {/* Featured Image */}
      {blog.thumbnail_image && (
        <div className="animate-in fade-in zoom-in-95 container mx-auto mb-10 max-w-6xl px-6 duration-1000 md:mb-24">
          <div className="bg-muted relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
            <Image
              unoptimized
              src={blog.thumbnail_image}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-6">
        <div
          className="prose prose-base sm:prose-lg md:prose-xl prose-stone dark:prose-invert prose-headings:font-normal prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-2xl max-w-none"
          style={{ fontFamily: theme?.fonts?.body }}
          dangerouslySetInnerHTML={{ __html: sanitizeContent(blog.content) }}
        />
      </div>
    </article>
  );
};
