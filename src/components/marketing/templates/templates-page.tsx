"use client";
import { useState } from "react";
import { TemplateCard } from "./template-card";
import { CategoryNavigation } from "./category-navigation";
import { useTemplates } from "@/hooks/super-admin/components/use-templates";
import { useTemplateCategories } from "@/hooks/super-admin/components/use-template-category";

// Local interface for UI categories
interface UICategory {
  key: string;
  label: string;
}

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      selectedCategory && selectedCategory !== "all"
        ? selectedCategory
        : undefined,
  });

  // Transform API categories to UI format
  const categories: UICategory[] = [
    { key: "all", label: "All Templates" },
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
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-12 lg:px-8 lg:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-foreground mb-4 text-2xl font-extrabold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Choose From Our Templates
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading templates...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-12 lg:px-8 lg:py-16">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-foreground mb-4 text-2xl font-extrabold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            Choose From {templatesData?.count || 0}+ Templates
          </h2>
        </div>

        {/* Category Navigation */}
        {categories.length > 0 && (
          <CategoryNavigation
            categories={categories}
            selectedCategory={selectedCategory || "all"}
            onCategoryChange={handleCategoryChange}
          />
        )}

        {/* Templates Grid */}
        {templatesData?.results && templatesData.results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {templatesData.results.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-gray-500">
                No templates found{" "}
                {selectedCategory && selectedCategory !== "all"
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
    </div>
  );
};

export default TemplatesPage;
