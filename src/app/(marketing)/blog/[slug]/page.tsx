"use client";

import { useParams, useRouter } from "next/navigation";
import { useMarketingBlog } from "@/hooks/marketing/use-blogs";
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
import { DetailSidebar } from "@/components/marketing/blog/sidebar";
import ArticleContent from "@/components/marketing/blog/article-content";
import RecentBlogs from "@/components/marketing/blog/recent-blogs";

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug =
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const { data: blog, isLoading, error } = useMarketingBlog(slug);

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
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <BreadcrumbPage className="line-clamp-1 text-xs sm:text-sm">
                    {blog?.title || "Not Found"}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-[20px] sm:h-[500px]" />
                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ) : error || !blog ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                  Blog not found
                </h2>
                <Button onClick={() => router.push("/blog")}>
                  Back to Blog
                </Button>
              </div>
            ) : (
              <article>
                <ArticleContent post={blog} />
              </article>
            )}
          </div>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <DetailSidebar />
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
