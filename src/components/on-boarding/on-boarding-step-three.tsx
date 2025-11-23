"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  useTemplateCategories,
  useTemplateSubcategories,
} from "@/hooks/super-admin/components/use-template-category";
import { Skeleton } from "@/components/ui/skeleton";

interface OnboardingStepThreeProps {
  categoryId?: number;
  onContinue: (subcategoryId?: number, type?: string) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const OnboardingStepThree = ({
  categoryId,
  onContinue,
  onBack,
  currentStep,
  totalSteps,
}: OnboardingStepThreeProps) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories = [] } = useTemplateCategories();
  const { data: subcategories = [], isLoading } =
    useTemplateSubcategories(categoryId);

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  const handleSubcategorySelect = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId);

    const selectedSub = subcategories.find(sub => sub.id === subcategoryId);
    const type = selectedSub
      ? `${selectedCategory?.name} - ${selectedSub.name}`
      : selectedCategory?.name;

    // Auto-continue to next step after selection
    setTimeout(() => {
      onContinue(subcategoryId, type);
    }, 300); // Small delay for better UX
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={() => onContinue(undefined, selectedCategory?.name)}
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
              Select website type
            </h1>
            <p className="text-gray-600">Select a subcategory to continue</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative mx-auto max-w-md">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Select website type..."
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

          {/* Subcategories Grid */}
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
                {filteredSubcategories.map(subcategory => (
                  <Card
                    key={subcategory.id}
                    className={`cursor-pointer overflow-hidden border-2 py-0 transition-all hover:scale-105 ${
                      selectedSubcategory === subcategory.id
                        ? "border-primary bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSubcategorySelect(subcategory.id)}
                  >
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {subcategory.name}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredSubcategories.length === 0 && (
                <div className="py-16 text-center">
                  <div className="mb-4 text-6xl">🔍</div>
                  <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                    No subcategories found
                  </h2>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No subcategories available for this category"}
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
