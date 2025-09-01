// components/admin/blogs/BlogsSearch.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface BlogsSearchProps {
  onSearch: (term: string) => void;
}

const BlogsSearch: React.FC<BlogsSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Search Blogs
          </Label>
          <div className="relative mt-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title, content..."
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            onClick={clearFilters}
            variant="outline"
            className="w-full sm:mt-6 sm:w-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogsSearch;
