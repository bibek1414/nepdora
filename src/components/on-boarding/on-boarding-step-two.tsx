"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTemplateCategories } from "@/hooks/super-admin/components/use-template-category";
import { Skeleton } from "@/components/ui/skeleton";

interface OnboardingStepTwoProps {
  onContinue: (categoryId?: number) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const OnboardingStepTwo = ({
  onContinue,
  onBack,
  currentStep,
  totalSteps,
}: OnboardingStepTwoProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories = [], isLoading } = useTemplateCategories();

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // Auto-continue to next step after selection
    setTimeout(() => {
      onContinue(categoryId);
    }, 300); // Small delay for better UX
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        <img src="/fulllogo.svg" alt="Logo" className="h-8" />
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => onContinue()}
        >
          Skip
        </button>
      </header>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="h-1 w-full bg-gray-200">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-primary mt-2 text-sm font-medium">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col px-6 py-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
              What type of website are you building?
            </h1>
            <p className="text-gray-600">Select a category to continue</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative mx-auto max-w-md">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-12 pr-10 pl-10 placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="mb-4 h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map(category => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer overflow-hidden border-2 py-0 transition-all hover:scale-105 ${
                      selectedCategory === category.id
                        ? "border-primary bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="py-16 text-center">
                  <div className="mb-4 text-6xl">🔍</div>
                  <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                    No categories found
                  </h2>
                  <p className="text-gray-600">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
