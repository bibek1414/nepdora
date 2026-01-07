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

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const executeSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    // Reset page on search, but don't add page=1
    params.delete("page");

    router.push(`/blog?${params.toString()}`);
  };

  // Simple debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only push if it's different (to avoid loop on initial load)
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
        onChange={handleSearch}
        className="w-full rounded-xl border-none bg-[#F4F6F8] py-4 pr-4 pl-12 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

export const CategoryList = () => {
  const { data: categories } = useMarketingBlogCategories();
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

    // Reset page, don't add page=1
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

export const TagList = () => {
  const { data: tags } = useMarketingBlogTags();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTags = searchParams.getAll("tags");

  const handleTagClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Toggle logic for tags
    if (currentTags.includes(slug)) {
      // Remove tag
      params.delete("tags");
      currentTags
        .filter(t => t !== slug)
        .forEach(t => params.append("tags", t));
    } else {
      // Add tag (using append to support multiple tags if backend supports it, derived from getAll)
      // The backend logic for multiple values using same key 'tags'
      params.append("tags", slug);
    }

    // Reset page
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

export const RecentPosts = () => {
  const { data: posts } = useMarketingRecentBlogs();

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
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src={post.thumbnail_image || "/images/placeholder.svg"}
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

const Sidebar: React.FC = () => {
  return (
    <div className="sticky top-24 flex flex-col gap-12">
      <SearchBar />
      <CategoryList />
      <TagList />
      <RecentPosts />
    </div>
  );
};
const DetailSidebar = () => {
  return (
    <div className="sticky top-24 flex flex-col gap-12">
      <div className="space-y-6 lg:w-96">
        <SearchBar />
        <RecentPosts />
      </div>
    </div>
  );
};

export { Sidebar, DetailSidebar };
