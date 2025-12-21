import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

interface PortfoliosSearchProps {
  onSearch: (term: string) => void;
}

const PortfoliosSearch: React.FC<PortfoliosSearchProps> = ({ onSearch }) => {
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
        placeholder="Search portfolio..."
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

export default PortfoliosSearch;
