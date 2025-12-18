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
    <div className="relative w-full sm:w-80">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="h-9 border-slate-200 bg-white pl-9 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default BlogsSearch;
