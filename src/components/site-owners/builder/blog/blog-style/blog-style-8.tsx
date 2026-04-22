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

interface BlogStyleProps {
  data: BlogData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BlogData>) => void;
}

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

  const content = (
    <>
      <div className="flex items-center justify-between gap-6">
        <span
          className={`text-2xl font-normal tracking-tight transition-transform duration-500 md:text-3xl lg:text-4xl ${
            isHovered ? "translate-x-2" : ""
          }`}
          style={{ fontFamily: theme?.fonts?.heading }}
        >
          {post.title}
        </span>
        <div
          className={`flex shrink-0 items-center gap-4 transition-all duration-500 ${
            isHovered ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
          }`}
        >
          <span className="text-sm font-medium tracking-widest uppercase">
            {post.tags?.[0]?.name || "Articles"}
          </span>
          <ChevronRight className="h-6 w-6" />
        </div>
      </div>

      <div
        className={`flex items-center gap-4 text-sm font-medium transition-transform duration-500 ${
          isHovered ? "translate-x-2" : ""
        }`}
      >
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <div
        className={`bg-muted/30 absolute inset-0 -z-10 transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );

  const commonClass =
    "relative flex flex-col gap-2 py-10 transition-all duration-500 hover:px-2";

  if (isEditable) {
    return <div className={`${commonClass} cursor-default`}>{content}</div>;
  }

  return (
    <Link
      href={getBlogUrl(post.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${commonClass} cursor-pointer`}
    >
      {content}
    </Link>
  );
};

export const BlogStyle8: React.FC<BlogStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { title = "Latest from the journal.", subtitle } = data || {};
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const pathname = usePathname();

  const {
    data: blogsData,
    isLoading,
    refetch,
  } = useBlogs({
    page: 1,
    page_size: 6,
  });
  const posts = blogsData?.results || [];

  const getBlogUrl = (slug: string) => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode ? "/blog-details-draft" : "/blog-details";
    return generateLinkHref(`${basePath}/${slug}`, siteUser, pathname);
  };

  return (
    <section className="bg-background py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 md:mb-24">
          <EditableText
            value={title}
            as="h1"
            onChange={val => onUpdate?.({ title: val })}
            isEditable={isEditable}
            className="text-3xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          />
          {subtitle && (
            <EditableText
              value={subtitle}
              as="p"
              onChange={val => onUpdate?.({ subtitle: val })}
              isEditable={isEditable}
              className="mt-6"
              style={{ fontFamily: theme?.fonts?.body }}
            />
          )}
        </div>

        {isLoading ? (
          <div className="divide-border divide-y border-t border-b">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-8">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              className={`divide-border flex flex-col divide-y overflow-hidden border-t border-b ${posts.length === 0 ? "hidden" : ""}`}
            >
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
          </>
        )}
      </div>
    </section>
  );
};
