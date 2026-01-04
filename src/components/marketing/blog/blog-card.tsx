"use client";

import React from "react";
import { BlogPost } from "@/types/super-admin/blog";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, className = "" }) => {
  const formattedDate = new Date(post.created_at);
  const month = format(formattedDate, "MMM");
  const day = format(formattedDate, "dd");

  const excerpt =
    post.meta_description ||
    post.content.replace(/<[^>]*>?/gm, "").slice(0, 150) + "...";

  const authorAvatar = "/icon.svg";
  const authorName = "Team Nepdora";

  return (
    <div
      className={`block flex h-full flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white ${className}`}
    >
      {/* Post Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.thumbnail_image || "/images/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="absolute top-4 left-4 z-10">
          {post.category && (
            <Link
              href={`/blog?category=${post.category.slug}`}
              className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest text-gray-900 uppercase backdrop-blur-sm transition-colors hover:bg-white"
            >
              {post.category.name}
            </Link>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="flex grow flex-col p-8">
        <div className="flex items-start gap-6">
          {/* Date Block */}
          <div className="flex min-w-[40px] flex-col items-center">
            <span className="text-sm font-medium text-gray-500 uppercase">
              {month}
            </span>
            <span className="text-3xl leading-tight font-bold text-gray-900">
              {day}
            </span>
          </div>

          {/* Title and Excerpt */}
          <div className="flex flex-col gap-3">
            <h3 className="line-clamp-2 cursor-pointer text-xl leading-tight font-bold text-gray-900 transition-colors">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                {post.title}
              </Link>
            </h3>
            {excerpt && (
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                {excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Author Footer */}
        <div className="mt-8 flex items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="flex h-full w-full items-center justify-center">
              <Image
                src={authorAvatar}
                alt={authorName}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {authorName}
            </span>
            <span className="text-xs text-gray-400">
              {post.time_to_read} min read
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
