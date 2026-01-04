"use client";

import { useParams, useRouter } from "next/navigation";
import { useSuperAdminBlog } from "@/hooks/super-admin/use-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Sidebar from "@/components/marketing/blog/sidebar";
import ArticleContent from "@/components/marketing/blog/article-content";
import RecentBlogs from "@/components/marketing/blog/recent-blogs";

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug =
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const { data: blog, isLoading, error } = useSuperAdminBlog(slug);

  if (isLoading) {
    return (
      <div className="w-full bg-white">
        <div className="flex h-[400px] w-full items-center justify-center bg-gray-100 sm:h-[500px] md:h-[600px]">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 md:py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-4 lg:col-span-8">
              <Skeleton className="h-4 w-full sm:h-6" />
              <Skeleton className="h-3 w-full sm:h-4" />
              <Skeleton className="h-3 w-full sm:h-4" />
              <Skeleton className="h-3 w-2/3 sm:h-4" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-48 w-full sm:h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">Blog not found</h2>
        <Button onClick={() => router.push("/blog")}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in bg-white duration-500">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-xs sm:text-sm">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog" className="text-xs sm:text-sm">
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 text-xs sm:text-sm">
                  {blog.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-32">
          <div className="lg:col-span-6">
            <article>
              <ArticleContent post={blog} />
            </article>
          </div>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Sidebar />
            </div>
          </aside>
        </div>

        {/* Recent Blogs Section */}
        <div className="mt-12 py-20 sm:mt-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              You Might Enjoy
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Check out more articles and insights from our latest posts.
            </p>
          </div>
          <RecentBlogs />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
