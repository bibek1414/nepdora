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

interface BlogDetailProps {
  slug: string;
  siteUser?: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ slug, siteUser }) => {
  const { data: blog, isLoading, error } = useBlog(slug); // Assuming useBlog hook fetches a single blog post by slug

  // Default fallback image
  const defaultImage =
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=800&h=600&fit=crop";

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <div className="mb-6">
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-4 md:col-span-1">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/blogs">Blogs</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Error</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/preview?site=${siteUser}&page=home`}
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
                <Link href={`/preview?site=${siteUser}&page=blogs`}>Blogs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {blog.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-16">
          <div className="md:col-span-2">
            <h1 className="text-foreground mb-4 text-3xl font-bold md:text-5xl">
              {blog.title}
            </h1>

            <div className="text-muted-foreground mb-6 flex flex-wrap items-center gap-4 text-sm">
              {blog.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{blog.author.username}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              {blog.time_to_read && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{blog.time_to_read} min read</span>
                </div>
              )}
            </div>

            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={blogImage}
                alt={blog.thumbnail_image_alt_description || blog.title}
                fill
                className="object-cover"
                onError={e => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
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

          {/* Sidebar for related content (can be extended) */}
          <div className="space-y-8 md:col-span-1">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                About the Author
              </h3>
              {blog.author ? (
                <div className="flex items-center space-x-4">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${blog.author.username}&background=random&color=fff`}
                    alt={blog.author.username}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-foreground font-semibold">
                      {blog.author.username}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Passionate writer and expert in technology.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Author information not available.
                </p>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Popular Posts
              </h3>
              {/* You might fetch actual popular posts here */}
              <ul className="space-y-3">
                {[
                  { title: "The Future of AI", slug: "the-future-of-ai" },
                  {
                    title: "Web Development Trends 2024",
                    slug: "web-development-trends-2024",
                  },
                  {
                    title: "Mastering React Hooks",
                    slug: "mastering-react-hooks",
                  },
                ].map((post, index) => (
                  <li key={index}>
                    <Link
                      href={`/preview?site=${siteUser}&page=blogs/${post.slug}`}
                      className="text-foreground hover:text-primary text-base transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
