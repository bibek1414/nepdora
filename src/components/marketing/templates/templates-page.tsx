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
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-5xl">
                Not just templates.
                <span className="font-serif text-slate-400 italic">
                  Unique Identities.
                </span>
              </h2>
            </div>
            <CategoryNavigationSkeleton />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-5xl">
              Not just templates.
              <span className="font-serif text-slate-400 italic">
                Unique Identities.
              </span>
            </h2>
          </div>

          <CategoryNavigation
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Templates Grid */}
        {templatesData?.results && templatesData.results.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {templatesData.results.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-gray-500">
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
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={!templatesData?.previous}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={!templatesData?.next}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
