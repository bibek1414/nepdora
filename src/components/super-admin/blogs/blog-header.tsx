// components/super-admin/blogs/blog-header.tsx
import React from "react";

interface BlogsHeaderProps {
  onCreateNew: () => void;
  onRefresh: () => void;
  blogsCount?: number;
}

const BlogsHeader: React.FC<BlogsHeaderProps> = () => {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-[#003d79]">Blogs</h1>
    </div>
  );
};

export default BlogsHeader;
