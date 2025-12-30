"use client";
import { useState } from "react";
import { TemplateCard, TemplateCardSkeleton } from "./template-card";
import {
  CategoryNavigation,
  CategoryNavigationSkeleton,
} from "./category-navigation";
import { useTemplates } from "@/hooks/super-admin/components/use-templates";
import { useTemplateCategories } from "@/hooks/super-admin/components/use-template-category";

// Local interface for UI categories
interface UICategory {
  key: string;
  label: string;
}

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useTemplateCategories();

  // Fetch templates with category filter
  const { data: templatesData, isLoading: templatesLoading } = useTemplates({
    page: currentPage,
    pageSize: pageSize,
    category:
      selectedCategory && selectedCategory !== "All"
        ? selectedCategory
        : undefined,
  });

  // Transform API categories to UI format
  const categories: UICategory[] = [
    { key: "All", label: "All" },
    ...(categoriesData || []).map(cat => ({
      key: cat.slug,
      label: cat.name,
    })),
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (templatesData?.next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (templatesData?.previous) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (categoriesLoading || templatesLoading) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6">
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:mb-10 sm:gap-6 md:mb-12">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                Featured Website Templates
              </h2>
              <p className="text-center text-sm text-slate-600">
                Monthly updated templates to help you get started.
              </p>
            </div>
            <CategoryNavigationSkeleton />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:gap-6 md:mb-12">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              Featured Website Templates
            </h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Monthly updated templates to help you get started.
            </p>
          </div>

          <CategoryNavigation
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Templates Grid */}
        {templatesData?.results && templatesData.results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
            {templatesData.results.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 sm:py-12">
            <div className="text-center">
              <p className="text-sm text-slate-600 sm:text-base md:text-lg">
                No templates found{" "}
                {selectedCategory && selectedCategory !== "All"
                  ? "in this category"
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {(templatesData?.next || templatesData?.previous) && (
          <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
            <button
              onClick={handlePrevPage}
              disabled={!templatesData?.previous}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              Previous
            </button>
            <span className="text-xs text-slate-600 sm:text-sm">
              Page {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!templatesData?.next}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplatesPage;
