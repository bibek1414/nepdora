import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface PortfoliosSearchProps {
  onSearch: (term: string) => void;
}

const PortfoliosSearch: React.FC<PortfoliosSearchProps> = ({ onSearch }) => {
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
    <div className="relative w-full sm:w-80">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="text"
        id="search"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search portfolios..."
        className="h-9 border-slate-200 bg-white pl-9 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
      />
    </div>
  );
};

export default PortfoliosSearch;
