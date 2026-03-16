"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Package } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

export default function TrackOrderLanding() {
  const router = useRouter();
  const { data: themeResponse } = useThemeQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#4F46E5", // Default indigo-600
    },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const currentPath = window.location.pathname;
      // Navigate to the order number page
      router.push(`${currentPath}/${searchQuery.trim()}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/50"
      >
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50"
          style={{ backgroundColor: `${theme.colors.primary}1A` }}
        >
          <Package
            className="h-10 w-10 text-indigo-600"
            style={{ color: theme.colors.primary }}
          />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Track Your Order
        </h1>
        <p className="mb-8 text-slate-500">
          Enter your order number to check the status of your purchase.
        </p>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute top-1/4 ml-2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Enter order number (e.g. ORD-F7E6C855)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-12 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Track Order
          </button>
        </form>

        <button
          onClick={() => router.back()}
          className="mx-auto mt-6 flex items-center justify-center gap-2 font-medium text-slate-400 transition-colors hover:text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
