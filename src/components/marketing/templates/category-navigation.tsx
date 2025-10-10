"use client";
import React from "react";
import { Category, CategoryKey } from "./types";

interface CategoryNavigationProps {
  categories: Category[];
  selectedCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-8 sm:mb-12">
      {/* Mobile: Horizontal scroll */}
      <div className="flex justify-start overflow-x-auto pb-2 sm:justify-center">
        <div className="inline-flex gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm md:px-6 ${
                selectedCategory === category.key
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
