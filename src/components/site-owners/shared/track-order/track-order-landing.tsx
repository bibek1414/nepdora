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
    }
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center"
      >
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${theme.colors.primary}1A` }}>
          <Package className="w-10 h-10 text-indigo-600" style={{ color: theme.colors.primary }} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Track Your Order</h1>
        <p className="text-slate-500 mb-8">
          Enter your order number to check the status of your purchase.
        </p>
        
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute top-1/4 -translate-y-1/2 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Enter order number (e.g. ORD-F7E6C855)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button 
            type="submit"
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Track Order
          </button>
        </form>
        
        <button 
          onClick={() => router.back()}
          className="mt-6 text-slate-400 hover:text-slate-600 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
