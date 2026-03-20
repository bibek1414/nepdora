"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useMarketingRecentBlogs,
  useMarketingBlogCategories,
  useMarketingBlogTags,
} from "@/hooks/marketing/use-blogs";
import Link from "next/link";
import { format } from "date-fns";
import {
  BlogPost,
  BlogCategory,
  BlogTag,
} from "@/types/super-admin/blog";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const executeSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        executeSearch(searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="group relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <svg
          className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-xl border-none bg-[#F4F6F8] py-4 pr-4 pl-12 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

export const CategoryList = ({ initialData }: { initialData?: BlogCategory[] }) => {
  const { data: categories } = useMarketingBlogCategories({ initialData });
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentCategory === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-bold text-gray-900">Categories</h4>
      <div className="space-y-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className="group flex cursor-pointer items-center gap-3"
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${currentCategory === cat.slug ? "bg-primary" : "bg-secondary"} transition-colors`}
            />
            <span
              className={`text-sm font-medium transition-colors ${currentCategory === cat.slug ? "text-primary font-bold" : "group-hover:text-primary text-gray-700"}`}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TagList = ({ initialData }: { initialData?: BlogTag[] }) => {
  const { data: tags } = useMarketingBlogTags({ initialData });
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTags = searchParams.getAll("tags");

  const handleTagClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentTags.includes(slug)) {
      params.delete("tags");
      currentTags
        .filter(t => t !== slug)
        .forEach(t => params.append("tags", t));
    } else {
      params.append("tags", slug);
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-bold text-gray-900">Popular tags</h4>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => {
          const isActive = currentTags.includes(tag.slug);
          return (
            <span
              key={tag.id}
              onClick={() => handleTagClick(tag.slug)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                isActive
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const RecentPosts = ({ initialData }: { initialData?: BlogPost[] }) => {
  const { data: posts } = useMarketingRecentBlogs({ initialData });

  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-bold text-gray-900">Recent posts</h4>
      <div className="space-y-6">
        {posts.slice(0, 4).map(post => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex cursor-pointer gap-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={post.thumbnail_image || "/fallback/image-not-found.png"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <h5 className="line-clamp-2 text-sm leading-snug font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                {post.title}
              </h5>
              <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-gray-400">
                <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                {post.time_to_read && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>{post.time_to_read} min read</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export interface SidebarProps {
  initialCategories?: BlogCategory[];
  initialTags?: BlogTag[];
  initialRecentPosts?: BlogPost[];
}

const Sidebar: React.FC<SidebarProps> = ({ initialCategories, initialTags, initialRecentPosts }) => {
  return (
    <div className="sticky top-24 flex flex-col gap-12">
      <SearchBar />
      <CategoryList initialData={initialCategories} />
      <TagList initialData={initialTags} />
      <RecentPosts initialData={initialRecentPosts} />
    </div>
  );
};

const DetailSidebar = ({ initialRecentPosts }: { initialRecentPosts?: BlogPost[] }) => {
  return (
    <div className="sticky top-24 flex flex-col gap-12">
      <div className="space-y-6 lg:w-96">
        <SearchBar />
        <RecentPosts initialData={initialRecentPosts} />
      </div>
    </div>
  );
};

export { Sidebar, DetailSidebar };
