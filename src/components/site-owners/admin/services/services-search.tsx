import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface ServicesSearchProps {
  onSearch: (term: string) => void;
}

const ServicesSearch: React.FC<ServicesSearchProps> = ({ onSearch }) => {
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
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="h-9 border-slate-200 bg-white pr-10 pl-10 text-sm placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-900"
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
    </div>
  );
};

export default ServicesSearch;
