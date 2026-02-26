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

export const BlogDetail2: React.FC<BlogDetailProps> = ({ slug, siteUser }) => {
  const pathname = usePathname();
  const { data: blog, isLoading, error } = useBlog(slug);

  const defaultImage =
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=800&h=600&fit=crop";

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="mb-6 h-5 w-64" />
          <Skeleton className="mx-auto mb-4 h-12 w-3/4" />
          <Skeleton className="mx-auto mb-8 h-6 w-1/3" />
          <Skeleton className="mb-12 h-[400px] w-full rounded-xl" />
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
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
        <div className="mb-8 flex justify-center">
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

        <div className="mb-12 text-center">
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-4 flex justify-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                {blog.tags[0].name}
              </Badge>
            </div>
          )}
          <h1 className="text-foreground mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>
          <div className="text-muted-foreground flex items-center justify-center gap-6 text-sm">
            {blog.author && (
              <div className="flex items-center gap-2">
                <Image
                  src={`https://ui-avatars.com/api/?name=${blog.author.username}&background=random&color=fff`}
                  alt={blog.author.username}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-foreground font-medium">
                  {blog.author.username}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-2xl shadow-xl md:h-[500px]">
          <Image
            src={blogImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        <div
          className="prose prose-lg dark:prose-invert mx-auto break-words"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer author bio */}
        {blog.author && (
          <div className="mt-16 flex flex-col items-center gap-6 border-t pt-8 text-center sm:flex-row sm:items-start sm:text-left">
            <Image
              src={`https://ui-avatars.com/api/?name=${blog.author.username}&background=random&color=fff`}
              alt={blog.author.username}
              width={80}
              height={80}
              className="overflow-hidden rounded-full shadow-md"
            />
            <div>
              <h4 className="mb-2 text-xl font-bold">
                Written by {blog.author.username}
              </h4>
              <p className="text-muted-foreground mb-4">
                Sharing insights and knowledge from across the industry.
                Delivering quality content to readers worldwide.
              </p>
              <Button variant="outline" size="sm">
                Follow Author
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Assuming Button might not be imported from lucide-react, I will just output standard HTML button to avoid complex imports not explicitly set
const Button: React.FC<any> = ({ children, variant, size, ...props }) => (
  <button
    className="hover:bg-muted rounded-md border px-4 py-2 text-sm"
    {...props}
  >
    {children}
  </button>
);
