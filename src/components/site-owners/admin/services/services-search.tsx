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
    <div className="relative w-full sm:w-64">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
      <Input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ServicesSearch;
