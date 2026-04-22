"use client";

import React, { useState } from "react";
import { BlogData } from "@/types/owner-site/components/blog";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { FileText } from "lucide-react";
import { formatDate } from "@/utils/date";

interface BlogStyleProps {
  data: BlogData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BlogData>) => void;
}

// Helper function to strip HTML and get plain text
const stripHtml = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Helper function to get excerpt from content or meta description
const getExcerpt = (post: any, maxLength: number = 160): string => {
  const text = post.meta_description
    ? stripHtml(post.meta_description)
    : post.content
      ? stripHtml(post.content)
      : "";

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const BlogPostItem = ({
  post,
  theme,
  isEditable,
  getBlogUrl,
}: {
  post: any;
  theme: any;
  isEditable: boolean;
  getBlogUrl: (slug: string) => string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const excerpt = getExcerpt(post);
  const tag = post.tags?.[0]?.name || "Article";
  const readTime = "5 min read"; // Default read time since it's not in the API yet

  const content = (
    <div className="grid gap-3 py-8 md:grid-cols-[140px_1fr_auto] md:items-baseline md:gap-8">
      {/* Date */}
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
        {formatDate(post.created_at)}
      </p>

      {/* Main Info */}
      <div className="min-w-0">
        <p
          className={`text-2xl transition-colors duration-200`}
          style={{
            fontFamily: theme?.fonts?.heading,
          }}
        >
          {post.title}
        </p>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
          {excerpt}
        </p>
      </div>

      {/* Chevron */}
      <div className="hidden self-center md:block">
        <ChevronRight
          className={`h-5 w-5 transition-all duration-300 ${
            isHovered ? "translate-x-1" : ""
          }`}
          style={{ color: isHovered ? theme?.colors?.primary : "currentColor" }}
        />
      </div>
    </div>
  );

  const containerClass = "block border-b border-border first:border-t";

  if (isEditable) {
    return <div className={`${containerClass} cursor-default`}>{content}</div>;
  }

  return (
    <Link
      href={getBlogUrl(post.slug)}
      className={`${containerClass} cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </Link>
  );
};

export const BlogStyle9: React.FC<BlogStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const {
    title = "Notes on design, engineering, and the work in between.",
    subtitle = "A small collection of essays I revisit often. New posts arrive roughly once a month — never on a strict schedule.",
    badge = "Blog",
  } = data || {};

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const pathname = usePathname();

  const {
    data: blogsData,
    isLoading,
    refetch,
  } = useBlogs({
    page: 1,
    page_size: 10,
  });
  const posts = blogsData?.results || [];

  const getBlogUrl = (slug: string) => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/blog-details-draft" : "/blog-details";
    return generateLinkHref(`${basePath}/${slug}`, siteUser, pathname);
  };

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-8">
        {/* Header Section */}
        <div className="mb-16 max-w-3xl">
          <EditableText
            value={badge}
            as="p"
            onChange={val => onUpdate?.({ badge: val })}
            isEditable={isEditable}
            className="text-primary text-[10px] tracking-[0.3em] uppercase"
            style={{ color: theme?.colors?.primary }}
          />
          <EditableText
            value={title}
            as="title"
            onChange={val => onUpdate?.({ title: val })}
            isEditable={isEditable}
            className="mt-6 text-4xl leading-[1.1] md:text-6xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          />
          <EditableText
            value={subtitle}
            as="p"
            onChange={val => onUpdate?.({ subtitle: val })}
            isEditable={isEditable}
            className="text-muted-foreground mt-8 max-w-xl text-lg leading-relaxed"
            style={{ fontFamily: theme?.fonts?.body }}
          />
        </div>

        {/* Blog items list */}
        {isLoading ? (
          <div className="border-border divide-y border-y">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-12">
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className={`${posts.length === 0 ? "hidden" : ""}`}>
              {posts.map(post => (
                <BlogPostItem
                  key={post.id}
                  post={post}
                  theme={theme}
                  isEditable={isEditable}
                  getBlogUrl={getBlogUrl}
                />
              ))}
            </div>

            <BuilderEmptyState
              icon={FileText}
              title="No Blog Posts Found"
              description="You haven't created any blog posts yet. Start by adding your first article."
              actionLabel="Add New Blog"
              actionLink="/admin/blogs"
              isEditable={isEditable}
              onRefresh={refetch}
              isEmpty={!isLoading && posts.length === 0}
            />
          </div>
        )}
      </div>
    </section>
  );
};
