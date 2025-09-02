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
    <div className="mb-12">
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 ${
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

      {/* Active category underline */}
      <div className="mt-4 flex justify-center">
        <div className="relative">
          <div className="flex space-x-16">
            {categories.map(category => (
              <div key={category.key} className="relative">
                {selectedCategory === category.key && (
                  <div className="absolute right-0 -bottom-1 left-0 h-0.5 bg-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
