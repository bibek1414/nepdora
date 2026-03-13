"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, AlertCircle } from "lucide-react";
import { useTemplateCategories } from "@/hooks/super-admin/components/use-template-category";

export const PopularCategories = () => {
  const { data: categories, isLoading, error } = useTemplateCategories();

  if (isLoading) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 h-20 w-1/3 animate-pulse rounded-lg bg-slate-100" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
            <h3 className="text-lg font-semibold text-slate-900">
              Failed to load categories
            </h3>
            <p className="text-slate-500">
              Please try again later or refresh the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              Popular website categories
            </h2>
            <p className="text-slate-500">
              Explore the best Nepdora templates, highly-rated amongst local businesses and creators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.slice(0, 6).map(category => (
            <div className="group relative flex h-40 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all hover:border-slate-300">
              <div className="flex w-1/2 flex-col justify-center p-6">
                <h3 className="text-lg font-bold text-slate-900">
                  {category.name}
                </h3>
              </div>
              <div className="relative w-1/2 overflow-hidden bg-white/50">
                {/* Placeholder for category preview images */}
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                  📁
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
