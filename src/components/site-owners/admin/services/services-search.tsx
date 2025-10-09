import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

  const clearFilters = () => {
    setSearchTerm("");
    onSearch("");
  };
  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };
  return (
    <div className="mb-6 rounded-lg bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <div className="relative mt-1">
            {/* Search icon */}
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />

            {/* Input */}
            <Input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title, description..."
              className="w-full pr-10 pl-10 placeholder:text-gray-400"
            />

            {/* Clear button inside input */}
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
      </div>
    </div>
  );
};

export default ServicesSearch;
