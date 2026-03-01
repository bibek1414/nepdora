"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBlog } from "@/hooks/owner-site/admin/use-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface BlogDetailProps {
  slug: string;
  siteUser?: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ slug, siteUser }) => {
  const pathname = usePathname();
  const { data: blog, isLoading, error } = useBlog(slug);

  const defaultImage =
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=800&h=600&fit=crop";

  if (isLoading) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto mb-12 px-4 md:px-8">
          <div className="mb-6 flex justify-center">
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="mx-auto mb-8 max-w-4xl space-y-4 text-center">
            <Skeleton className="mx-auto h-12 w-3/4" />
            <Skeleton className="mx-auto h-6 w-1/3" />
          </div>
          <Skeleton className="mx-auto mb-10 aspect-[16/9] h-[300px] w-full rounded-xl md:h-[450px]" />
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Could not load blog post details. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const blogImage = blog.thumbnail_image || defaultImage;

  return (
    <div className="bg-background pt-20 pb-0">
      <div className="container mx-auto mb-12 px-4 md:px-8">
        <nav className="mb-6">
          <ol className="text-muted-foreground flex flex-wrap items-center justify-center gap-2 text-sm">
            <li>
              <Link
                href={
                  siteUser
                    ? pathname?.includes("/preview/")
                      ? `/preview/${siteUser}`
                      : `/`
                    : "/"
                }
                className="hover:text-primary font-medium transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>

            <li className="text-foreground line-clamp-1 text-center font-medium">
              {blog.title}
            </li>
          </ol>
        </nav>

        <div className="mx-auto mb-8 max-w-4xl text-center">
          <h1 className="text-foreground mb-4 text-3xl leading-[1.15] font-semibold md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>
          <div className="text-muted-foreground text-sm">
            last updated: {formatDate(blog.created_at)}
          </div>
        </div>

        <div className="mx-auto mb-10 aspect-[16/9] h-[300px] overflow-hidden rounded-xl md:h-[450px]">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description ?? blog.title}
            width={1200}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="prose prose-xl dark:prose-invert rich-text mx-auto mb-8 max-w-3xl space-y-8 leading-8">
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeContent(blog.content) }}
          />
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mx-auto mb-20 flex max-w-3xl flex-wrap items-center gap-2">
            <span className="text-foreground font-semibold">Tags:</span>
            {blog.tags.map(tag => (
              <Badge key={tag.id} variant="outline">
                <Tag className="mr-1 h-3 w-3" />
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
