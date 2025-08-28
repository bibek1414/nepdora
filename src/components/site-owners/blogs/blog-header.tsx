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
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">
            Blog Management
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:mt-2 sm:text-base">
            Manage your blog posts and content.
            {blogsCount !== undefined && (
              <span className="text-primary mt-1 block text-xs font-medium sm:mt-0 sm:ml-2 sm:inline sm:text-sm">
                {blogsCount} total blog{blogsCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <Button
            onClick={onCreateNew}
            size="sm"
            className="h-9 bg-gray-600 px-3 text-white hover:bg-gray-600 sm:h-10 sm:px-4"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="xs:inline hidden sm:inline">Create New</span>
            <span className="xs:hidden sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogsHeader;
