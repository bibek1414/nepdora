"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBlog } from "@/hooks/owner-site/admin/use-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlertCircle, CalendarDays, Home, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface BlogDetailProps {
  slug: string;
  siteUser?: string;
}

export const BlogDetail2: React.FC<BlogDetailProps> = ({ slug, siteUser }) => {
  const pathname = usePathname();
  const { data: blog, isLoading, error } = useBlog(slug);

  const defaultImage = "/fallback/image-not-found.png";

  if (isLoading) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="mb-6 h-5 w-64" />
          <Skeleton className="mb-4 h-12 w-2/3" />
          <Skeleton className="mb-8 h-6 w-1/4" />
          <Skeleton className="mb-12 h-[450px] w-full rounded-2xl" />
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Alert variant="destructive">
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
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="mb-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={
                      siteUser
                        ? pathname?.includes("/preview/")
                          ? `/preview/${siteUser}`
                          : `/`
                        : "/"
                    }
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-[200px] font-medium md:max-w-[400px]">
                  {blog.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
            {blog.title}
          </h1>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            {blog.time_to_read && (
              <>
                <span className="bg-muted-foreground hidden h-1 w-1 rounded-full sm:block" />
                <span>{blog.time_to_read} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Big Hero Image */}
        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-3xl shadow-sm md:h-[550px] lg:mb-20">
          <Image
            src={blogImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            priority
          />
        </div>

        {/* Content Layout (Sidebar approach) */}
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div
              className="prose prose-xl dark:prose-invert rich-text max-w-none break-words"
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(blog.content),
              }}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Author Card */}
            {blog.author && (
              <div className="bg-muted/30 flex flex-col items-center rounded-2xl border p-8 text-center shadow-sm">
                <div className="border-background relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 shadow-md">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${blog.author.username}&background=random&color=fff&size=128`}
                    alt={blog.author.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">
                  {blog.author.username}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Expert contributor and content writer sharing insights and
                  thoughts on this topic.
                </p>
                <Link
                  href={
                    siteUser
                      ? pathname?.includes("/preview/")
                        ? `/preview/${siteUser}/blogs`
                        : `/blogs`
                      : "/blogs"
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                >
                  View more articles
                </Link>
              </div>
            )}

            {/* Tags Card */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="bg-muted/30 rounded-2xl border p-6 shadow-sm">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Tag className="h-5 w-5" />
                  Related Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="hover:bg-secondary/80 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
