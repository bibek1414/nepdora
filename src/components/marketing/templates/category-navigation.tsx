"use client";
import React from "react";

interface Category {
  key: string;
  label: string;
}

interface CategoryNavigationProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.key}
          onClick={() => onCategoryChange(category.key)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category.key
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export const CategoryNavigationSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="h-9 w-24 animate-pulse rounded-full bg-slate-200"
        />
      ))}
    </div>
  );
};
