"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Info } from "lucide-react";

interface SubscriptionsHeaderProps {
  search: string;
  setSearch: (search: string) => void;
}

export function SubscriptionsHeader({
  search,
  setSearch,
}: SubscriptionsHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
      <div className="group relative w-full md:w-[360px]">
        <Search className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
        <Input
          placeholder="Search by tenant name, plan, or reference..."
          className="-sm h-12 rounded-2xl border-slate-200 bg-white pl-11 text-sm font-medium transition-all placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
