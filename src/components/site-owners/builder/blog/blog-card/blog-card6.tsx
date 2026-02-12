import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, User, Calendar, ChevronRight } from "lucide-react";
import { BlogPost } from "@/types/owner-site/admin/blog";
import { formatDate } from "@/utils/date";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { usePathname } from "next/navigation";

interface BlogCard6Props {
  blogs: BlogPost[];
  siteUser?: string;
  onPostClick?: (blog: BlogPost) => void;
}

// Sidebar: only Search + Popular Tags (no popular posts, no category)
const BlogSidebar6: React.FC<{
  colors: {
    primary: string;
    border: string;
    text: string;
    mutedForeground: string;
  };
  fonts: { body: string };
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}> = ({ colors, fonts, searchValue, onSearchChange, onSearchSubmit }) => {
  return (
    <div className="w-full shrink-0 md:w-[300px]">
      {/* Search Widget */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search.."
          className="h-[48px] w-full rounded-full border bg-white pr-12 pl-5 text-[14px] font-normal text-[#9CA3AF] placeholder-[#9CA3AF] outline-none"
          style={{
            borderColor: colors.border,
            fontFamily: fonts.body,
          }}
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearchSubmit();
            }
          }}
        />
        <button
          className="absolute top-1/2 right-1.5 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: colors.primary }}
          type="button"
          onClick={onSearchSubmit}
        >
          <Search className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};

// Single blog post card layout (main column)
const BlogPostCard6: React.FC<{
  blog: BlogPost;
  colors: {
    text: string;
    primary: string;
    primaryForeground: string;
    mutedForeground: string;
  };
  fonts: { body: string; heading: string };
  siteUser?: string;
  onClick?: (blog: BlogPost) => void;
}> = ({ blog, colors, fonts, siteUser, onClick }) => {
  const blogImage =
    blog.thumbnail_image ||
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=1000&h=600&fit=crop";

  const authorName = blog.author
    ? `${blog.author.first_name} ${blog.author.last_name}`.trim() ||
      blog.author.username
    : "admin";

  const getExcerpt = (content: string, maxLength: number = 320): string => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength).trimEnd() + "..."
      : text;
  };

  const pathname = usePathname();

  const getDetailsUrl = (): string => {
    if (siteUser) {
      if (pathname?.includes("/preview/")) {
        return `/preview/${siteUser}/blogs/${blog.slug}`;
      }
      if (pathname?.includes("/publish/")) {
        return `/blogs/${blog.slug}`;
      }
      return `/blogs/${blog.slug}`;
    }
    return `/blogs/${blog.slug}`;
  };

  const handleNavigate = () => {
    if (onClick) {
      onClick(blog);
      return;
    }
    window.location.href = getDetailsUrl();
  };

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    siteUser ? (
      <Link href={getDetailsUrl()}>{children}</Link>
    ) : (
      <div onClick={handleNavigate} className="cursor-pointer">
        {children}
      </div>
    );

  return (
    <Wrapper>
      <article className="w-full border-b border-gray-100 pb-10 last:mb-0 last:border-0 last:pb-0">
        {/* Image Placeholder - exact sizing */}
        <div className="mb-5 h-[200px] w-full overflow-hidden rounded-[15px] bg-[#D9D9D9] md:h-[260px]">
          <Image
            src={blogImage}
            alt={blog.thumbnail_image_alt_description || blog.title}
            width={1000}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Meta Data */}
        <div className="mb-3 flex flex-wrap items-center gap-4 text-[#111214] md:gap-6">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" style={{ color: colors.text }} />
            <span className="text-[13px] leading-[20px] font-normal">
              By {authorName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" style={{ color: colors.text }} />
            <span className="text-[13px] leading-[20px] font-normal">
              {formatDate(blog.created_at)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-[22px] leading-[1.3] font-bold text-black md:text-[30px]">
          {blog.title}
        </h2>

        {/* Description */}
        <p className="mb-5 text-[15px] leading-[26px] font-normal text-[#727272]">
          {getExcerpt(blog.meta_description || blog.content || "", 320)}
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={handleNavigate}
          className="flex h-[44px] items-center gap-2 rounded-full px-6 transition-colors"
        >
          <span className="text-[13px] font-semibold">Learn More</span>
          <ChevronRight className="h-3 w-3 stroke-3" />
        </button>
      </article>
    </Wrapper>
  );
};

// Bottom pagination – styled like design, but backed by API pagination
const Pagination6: React.FC<{
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, start + 2);
  const adjustedStart = Math.max(1, end - 2);
  for (let p = adjustedStart; p <= end; p++) {
    pages.push(p);
  }

  return (
    <div className="mt-6 flex items-center justify-start gap-3">
      {pages.map(p => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`flex h-[40px] w-[40px] items-center justify-center rounded-[5px] border bg-white text-[#034833] ${
            p === page ? "border-[#83CD20]" : "border-[#E3DBD8]"
          }`}
        >
          <span className="text-[16px] font-bold">{p}</span>
        </button>
      ))}
    </div>
  );
};

// Full section layout: main posts + sidebar
export const BlogCard6: React.FC<BlogCard6Props> = ({
  blogs,
  siteUser,
  onPostClick,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#111214",
      primary: "#83CD20",
      primaryForeground: "#FFFFFF",
      secondary: "#034833",
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
      border: "#E5E7EB",
      mutedForeground: "#727272",
    },
    fonts: {
      body: "Plus Jakarta Sans",
      heading: "Plus Jakarta Sans",
    },
  };

  const colors = {
    ...theme.colors,
    mutedForeground:
      // @ts-expect-error - some themes may not define mutedForeground
      theme.colors.mutedForeground || "#727272",
  } as typeof theme.colors & { mutedForeground: string };

  // Fetch blogs with search + pagination against backend API
  const { data: searchResponse } = useBlogs({
    page,
    page_size: pageSize,
    search: searchQuery,
  });

  const displayBlogs = searchResponse?.results || blogs;
  const totalCount = searchResponse?.count;
  const totalPages =
    totalCount && totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;

  return (
    <div className="mx-auto w-full max-w-[1000px] py-8 lg:py-12">
      <div className="flex flex-col items-start gap-6 md:flex-row lg:gap-8">
        {/* Main Content Column */}
        <div className="w-full flex-1">
          <div className="flex flex-col gap-10">
            {displayBlogs.map(blog => (
              <BlogPostCard6
                key={blog.id}
                blog={blog}
                colors={{
                  text: colors.text,
                  primary: colors.primary,
                  primaryForeground: colors.primaryForeground,
                  mutedForeground: colors.mutedForeground,
                }}
                fonts={theme.fonts}
                siteUser={siteUser}
                onClick={onPostClick}
              />
            ))}
          </div>

          <Pagination6
            page={page}
            totalPages={totalPages}
            onPageChange={newPage => setPage(newPage)}
          />
        </div>

        {/* Sidebar Column */}
        <BlogSidebar6
          colors={{
            primary: colors.primary,
            // @ts-expect-error - some themes may not define border
            border: colors.border || "#E3DBD8",
            text: colors.text,
            mutedForeground: colors.mutedForeground,
          }}
          fonts={{ body: theme.fonts.body }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearchSubmit={() => {
            setPage(1);
            setSearchQuery(searchInput.trim() || undefined);
          }}
        />
      </div>
    </div>
  );
};
