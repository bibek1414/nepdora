"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
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
import {
  AlertCircle,
  CalendarDays,
  User,
  Clock,
  Home,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date";
import { usePathname } from "next/navigation";

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
      <div className="bg-background">
        <Skeleton className="mb-12 h-[500px] w-full" />
        <div className="container mx-auto max-w-3xl px-4 pb-8">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
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
    <div className="bg-background">
      {/* Hero Header with Overlay */}
      <div className="relative flex h-[60vh] min-h-[400px] w-full items-center justify-center text-center">
        <Image
          src={blogImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />

        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-white">
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-6 flex justify-center gap-2">
              <span className="text-primary text-sm font-bold tracking-widest uppercase">
                {blog.tags[0].name}
              </span>
            </div>
          )}
          <h1 className="mb-6 text-4xl font-black drop-shadow-md md:text-6xl">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-200">
            {blog.author && (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{blog.author.username}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="mb-12 border-b pb-4">
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
                    className="flex items-center gap-2"
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
                  >
                    Blogs
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{blog.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div
          className="prose prose-xl dark:prose-invert text-foreground max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
};
