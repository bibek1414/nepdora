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
            Blogs
          </h1>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <Button
            onClick={onCreateNew}
            size="sm"
            className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            Add Blog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogsHeader;
