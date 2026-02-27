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
import { AlertCircle, CalendarDays, User, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface BlogDetailProps {
  slug: string;
  siteUser?: string;
}

export const BlogDetail3: React.FC<BlogDetailProps> = ({ slug, siteUser }) => {
  const pathname = usePathname();
  const { data: blog, isLoading, error } = useBlog(slug);

  const defaultImage =
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=800&h=600&fit=crop";

  if (isLoading) {
    return (
      <div className="bg-background pt-0 pb-0">
        <Skeleton className="h-[60vh] min-h-[500px] w-full" />
        <div className="relative z-20 container mx-auto -mt-32 max-w-4xl px-4 pb-16">
          <div className="bg-card rounded-2xl border p-8 shadow-xl">
            <Skeleton className="mx-auto h-40 w-full" />
            <Skeleton className="mx-auto mt-8 h-8 w-3/4" />
            <Skeleton className="mx-auto mt-4 h-8 w-1/2" />
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
    <div className="bg-muted/10 min-h-screen pt-0 pb-0">
      {/* Immersive Hero Header */}
      <div className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center pt-20">
        <Image
          src={blogImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        <div className="relative z-10 container mx-auto mt-12 max-w-4xl px-4 text-center">
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-6 flex justify-center gap-2">
              <Badge className="bg-primary hover:bg-primary border-none px-4 py-1.5 font-bold tracking-widest uppercase shadow-xl">
                {blog.tags[0].name}
              </Badge>
            </div>
          )}
          <h1 className="mb-8 text-4xl leading-tight font-black text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-lg font-medium text-white/90 drop-shadow-md">
            {blog.author && (
              <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/50">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${blog.author.username}&background=random&color=fff`}
                    alt={blog.author.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <span>{blog.author.username}</span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md">
              <CalendarDays className="h-5 w-5" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card Content Container */}
      <div className="relative z-20 container mx-auto -mt-24 max-w-4xl px-4 pb-24 md:-mt-32">
        <div className="bg-background rounded-3xl border p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] md:p-12 lg:p-16">
          <div className="border-border/60 mb-10 flex justify-center border-b pb-8">
            <Breadcrumb>
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
                      className="text-muted-foreground hover:text-primary flex items-center gap-2 font-medium transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={
                        siteUser
                          ? pathname?.includes("/preview/")
                            ? `/preview/${siteUser}/blogs`
                            : `/blogs`
                          : "/blogs"
                      }
                      className="text-muted-foreground hover:text-primary font-medium transition-colors"
                    >
                      Blogs
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground max-w-[150px] truncate font-semibold sm:max-w-[250px]">
                    {blog.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div
            className="prose prose-xl dark:prose-invert rich-text text-foreground mx-auto max-w-none leading-relaxed break-words"
            dangerouslySetInnerHTML={{ __html: sanitizeContent(blog.content) }}
          />
        </div>
      </div>
    </div>
  );
};
