"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TemplateCard, TemplateCardSkeleton } from "./template-card";
import { CategoryNavigation } from "./category-navigation";
import { useTemplateApi } from "@/services/api/super-admin/components/template";
import { Template } from "@/types/super-admin/components/template";

interface UICategory {
  key: string;
  label: string;
}

interface TemplatesData {
  count: number;
  next: string | null;
  previous: string | null;
  results: Template[];
}

interface TemplatesInteractiveProps {
  initialCategories: UICategory[];
  initialTemplates: TemplatesData;
}

const PAGE_SIZE = 12;

const TemplatesInteractive = ({
  initialCategories,
  initialTemplates,
}: TemplatesInteractiveProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const isInitialState = selectedCategory === "All" && currentPage === 1;

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["templates-marketing", currentPage, PAGE_SIZE, selectedCategory],
    queryFn: () =>
      useTemplateApi.getTemplates(
        currentPage,
        PAGE_SIZE,
        selectedCategory !== "All" ? selectedCategory : undefined
      ),
    initialData: isInitialState ? initialTemplates : undefined,
    placeholderData: previousData => previousData,
  });

  const displayData = templatesData ?? initialTemplates;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="mb-8 flex justify-center sm:mb-10 md:mb-12">
        <CategoryNavigation
          categories={initialCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {isLoading && !isInitialState ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : displayData?.results?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
          {displayData.results.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-10 sm:py-12">
          <p className="text-sm text-slate-600 sm:text-base md:text-lg">
            No templates found
            {selectedCategory !== "All" ? " in this category" : ""}
          </p>
        </div>
      )}

      {!isLoading && (displayData?.next || displayData?.previous) && (
        <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={!displayData?.previous}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
          >
            Previous
          </button>
          <span className="text-xs text-slate-600 sm:text-sm">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={!displayData?.next}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default TemplatesInteractive;
