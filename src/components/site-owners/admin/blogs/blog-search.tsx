import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface BlogsSearchProps {
  onSearch: (term: string) => void;
}

const BlogsSearch: React.FC<BlogsSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="mt-10 mb-6">
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title, content..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-gray-200 bg-white pr-10 pl-10 placeholder:text-gray-500 focus:border-gray-300 focus:ring-0"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogsSearch;
