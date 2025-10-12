"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SupportHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
              Welcome to
            </h1>
            <h2 className="mb-8 text-5xl font-bold md:text-6xl">
              <span className="text-primary">NEPDORA</span>
              <span className="text-white"> support</span>
            </h2>

            {/* Search Bar */}
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="focus:border-primary focus:ring-primary/20 w-full border-slate-700 bg-slate-800/50 py-6 pr-4 pl-12 text-lg text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportHeader;
