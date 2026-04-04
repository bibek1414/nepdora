"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { BlogPost } from "../../../types/super-admin/blog";

interface RecentBlogsListProps {
  blogs: BlogPost[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const RecentBlogsList: React.FC<RecentBlogsListProps> = ({ blogs }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog, index) => (
        <motion.div
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all hover:shadow-md"
        >
          <div className="relative h-56 overflow-hidden">
            <Image
              src={blog.thumbnail_image || "/fallback/image-not-found.png"}
              alt={
                blog.thumbnail_image
                  ? blog.thumbnail_image_alt_description || blog.title
                  : `Thumbnail for blog post: ${blog.title}`
              }
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

            <h3 className="group-hover:text-primary mb-3 text-xl leading-tight font-bold text-slate-900 transition-colors">
              <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
