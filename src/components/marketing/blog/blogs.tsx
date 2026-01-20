"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMarketingBlogs } from "@/hooks/marketing/use-blogs";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { BlogFilters } from "@/types/super-admin/blog";
import BlogCard from "./blog-card";
import { Skeleton } from "@/components/ui/skeleton";

export const BlogCardSkeleton = () => (
  <div className="h-[400px] rounded-[32px] bg-white">
    <Skeleton className="h-64 w-full" />
    <div className="space-y-4 p-8">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center gap-3 pt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

const Blogs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || undefined;
  const tags = searchParams.getAll("tags");

  const pageSize = 12; // Adjusted for grid

  const queryFilters: BlogFilters = useMemo(
    () => ({
      page,
      search,
      page_size: pageSize,
      category,
      tags: tags.length > 0 ? tags : undefined,
      is_published: true,
    }),
    [page, search, category, tags]
  );

  const { data: blogData, isLoading, error } = useMarketingBlogs(queryFilters);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/blog?${params.toString()}`);
    // Scroll to top of feed?
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const blogs = blogData?.results || [];
  const totalBlogs = blogData?.count || 0;
  const totalPages = Math.ceil(totalBlogs / pageSize);

  if (error) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-bold text-slate-900">
          Failed to load blogs
        </h3>
        <p className="text-slate-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-1">
        <h2 className="text-4xl font-bold text-gray-900">
          Read Latest Blogs from Nepdora
        </h2>
        <p className="text-gray-600">
          Stay updated with the latest news, tips, and insights from our team.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(n => (
            <BlogCardSkeleton key={n} />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {blogs.map(blog => (
              <div key={blog.id} className="h-full">
                <BlogCard post={blog} />
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-12">
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="py-20 text-center">
          <h3 className="text-xl font-bold text-slate-900">No stories found</h3>
          <p className="text-slate-600">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Blogs;
