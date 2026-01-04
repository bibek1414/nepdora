"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSuperAdminRecentBlogs } from "@/hooks/super-admin/use-blogs";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const BlogCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
    <Skeleton className="h-48 w-full" />
    <div className="space-y-4 p-6">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between border-t border-black/5 pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

const RecentBlogs = () => {
  const { data: blogs, isLoading, error } = useSuperAdminRecentBlogs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(n => (
          <BlogCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (error || !blogs || blogs.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog, index) => (
        <motion.div
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all"
        >
          <div className="relative h-56 overflow-hidden">
            <Image
              src={blog.thumbnail_image || "/images/placeholder.svg"}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              {blog.tags?.[0] && (
                <span className="rounded-full border border-black/5 bg-white/90 px-3 py-1 text-xs font-semibold tracking-wider text-slate-900 uppercase backdrop-blur-sm">
                  {blog.tags[0].name}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4 flex items-center gap-4 text-xs text-black/40">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(blog.created_at)}
              </div>
              {blog.time_to_read && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {blog.time_to_read} min read
                </div>
              )}
            </div>

            <h3 className="mb-3 text-xl leading-tight font-bold text-slate-900 transition-colors group-hover:text-[#003d79]">
              <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentBlogs;
