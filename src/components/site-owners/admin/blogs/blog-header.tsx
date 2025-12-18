// components/admin/blogs/BlogsHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BlogsHeaderProps {
  onCreateNew: () => void;
  onRefresh: () => void;
  blogsCount?: number;
}

const BlogsHeader: React.FC<BlogsHeaderProps> = ({
  onCreateNew,
  blogsCount,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Blogs
        </h1>
        <p className="text-sm text-slate-500">
          Manage your blog posts and articles.{" "}
          {blogsCount !== undefined && (
            <span className="font-semibold text-slate-700">{blogsCount}</span>
          )}{" "}
          {blogsCount !== undefined && (
            <>{blogsCount === 1 ? "post" : "posts"} available.</>
          )}
        </p>
      </div>

      <Button
        onClick={onCreateNew}
        className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Blog
      </Button>
    </div>
  );
};

export default BlogsHeader;
