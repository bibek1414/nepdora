"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Search,
  X,
  Eye,
  Loader2,
  Grid3x3,
  LayoutGrid,
  Plus,
  Filter,
} from "lucide-react";
import { useTemplates } from "@/hooks/super-admin/components/use-templates";
import { Template } from "@/types/super-admin/components/template";
import { useRouter } from "next/navigation";
import useDebouncer from "@/hooks/use-debouncer";
import { LoadingScreen } from "@/components/on-boarding/loading-screen/loading-screen";

import {
  useTemplateCategories,
  useTemplateSubcategories,
} from "@/hooks/super-admin/components/use-template-category";
import {
  useImportTemplate,
  usePreviewTemplate,
} from "@/hooks/owner-site/admin/use-template";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/hooks/use-jwt-server";

interface OnboardingStepFourProps {
  websiteType: string;
  categoryId?: number;
  subcategoryId?: number;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  user: User;
}

export const OnboardingStepFour = ({
  websiteType,
  categoryId,
  subcategoryId,
  onBack,
  currentStep,
  totalSteps,
  user,
}: OnboardingStepFourProps) => {
  const router = useRouter();
  const { tokens } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showScratchConfirm, setShowScratchConfirm] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [gridView, setGridView] = useState<"large" | "compact">("large");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    categoryId
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    number | undefined
  >(subcategoryId);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchTerm = useDebouncer(searchTerm, 300);

  const { data: categories = [] } = useTemplateCategories();
  const { data: subcategories = [] } =
    useTemplateSubcategories(selectedCategory);

  // Get category slug for API call
  const getCategorySlug = () => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      return category?.slug;
    }
    return undefined;
  };
  const getSubcategorySlug = () => {
    if (selectedSubcategory) {
      const subcategory = subcategories.find(
        sub => sub.id === selectedSubcategory
      );
      return subcategory?.slug;
    }
    return undefined;
  };

  const {
    data: templatesData,
    isLoading,
    error,
  } = useTemplates({
    page: 1,
    pageSize: 50,
    category: getCategorySlug(),
    subcategory: getSubcategorySlug(),
    search: debouncedSearchTerm || undefined,
  });

  const templates = templatesData?.results || [];

  const { mutate: importTemplate, isPending } = useImportTemplate();
  const { openPreview } = usePreviewTemplate();

  // Set initial filters from props
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    if (subcategoryId) {
      setSelectedSubcategory(subcategoryId);
    }
  }, [categoryId, subcategoryId]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowConfirmDialog(true);
  };

  const handleConfirmImport = () => {
    if (selectedTemplate) {
      importTemplate(Number(selectedTemplate.id), {
        onSuccess: () => {
          setShowConfirmDialog(false);
          setShowLoadingScreen(true);

          setTimeout(() => {
            router.push(`/builder/${user.storeName}`);
          }, 5000);
        },
        onError: error => {
          console.error("Import failed:", error);
          setShowConfirmDialog(false);
          setShowLoadingScreen(false);
        },
      });
    }
  };

  const handlePreview = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    if (template.preview_url) {
      window.open(template.preview_url, "_blank", "noopener,noreferrer");
    } else {
      openPreview(template.schema_name);
    }
  };

  const handleStartFromScratchClick = () => {
    setShowScratchConfirm(true);
  };

  const handleConfirmStartFromScratch = () => {
    setShowScratchConfirm(false);
    setShowLoadingScreen(true);

    setTimeout(() => {
      router.push(`/builder/${user.storeName}`);
    }, 5000);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedSubcategory(undefined);
    setSearchTerm("");
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      return category?.name;
    }
    return "";
  };

  const getSelectedSubcategoryName = () => {
    if (selectedSubcategory) {
      const subcategory = subcategories.find(
        sub => sub.id === selectedSubcategory
      );
      return subcategory?.name;
    }
    return "";
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  const LoadingSkeleton = () => (
    <div
      className={`grid gap-6 ${
        gridView === "large"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-4/3 w-full" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <LoadingScreen isVisible={showLoadingScreen} />

      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </Button>
            <img src="/nepdora-logooo.svg" alt="Logo" className="h-8" />
            <div className="w-20"></div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white px-6 pb-4">
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
        <main className="flex-1 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                Select a website template
              </h1>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="h-12 pr-10 pl-10 placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearSearch}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {(selectedCategory || selectedSubcategory) && (
                      <span className="bg-primary flex h-2 w-2 rounded-full"></span>
                    )}
                  </Button>

                  <Button
                    variant={gridView === "large" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setGridView("large")}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={gridView === "compact" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setGridView("compact")}
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStartFromScratchClick}
                    className="ml-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start from scratch
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <Card className="p-4">
                  <CardContent className="p-0 py-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          value={selectedCategory || ""}
                          onChange={e => {
                            const categoryId = e.target.value
                              ? Number(e.target.value)
                              : undefined;
                            setSelectedCategory(categoryId);
                            setSelectedSubcategory(undefined);
                          }}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Subcategory
                        </label>
                        <select
                          value={selectedSubcategory || ""}
                          onChange={e => {
                            const subcategoryId = e.target.value
                              ? Number(e.target.value)
                              : undefined;
                            setSelectedSubcategory(subcategoryId);
                          }}
                          disabled={!selectedCategory}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:opacity-50"
                        >
                          <option value="">All Subcategories</option>
                          {subcategories.map(subcategory => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        disabled={!selectedCategory && !selectedSubcategory}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Filters */}
              {(selectedCategory || selectedSubcategory) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {selectedCategory && (
                    <span className="text-primary inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                      {getSelectedCategoryName()}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCategory(undefined);
                          setSelectedSubcategory(undefined);
                        }}
                        className="h-4 w-4"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  )}
                  {selectedSubcategory && (
                    <span className="text-primary inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                      {getSelectedSubcategoryName()}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedSubcategory(undefined)}
                        className="h-4 w-4"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Templates Grid */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading templates. Please try again later.
                </AlertDescription>
              </Alert>
            ) : !templates || templates.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl">📋</div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                  No templates found
                </h2>
                <p className="mb-6 text-gray-600">
                  {searchTerm || selectedCategory || selectedSubcategory
                    ? "Try adjusting your search or filters"
                    : "No templates available at the moment"}
                </p>
                <Button onClick={handleStartFromScratchClick} variant="outline">
                  Start from scratch
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    gridView === "large"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {templates.map(template => (
                    <Card
                      key={template.id}
                      className="group overflow-hidden border-2 border-gray-200 py-0 shadow-none transition-all duration-300"
                    >
                      <div
                        className="relative aspect-4/3 cursor-pointer overflow-hidden bg-gray-100"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        {template.template_image ? (
                          <img
                            src={template.template_image}
                            alt={template.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <span className="text-4xl text-gray-400">📄</span>
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            onClick={e => handlePreview(template, e)}
                            variant="secondary"
                            size="lg"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                        </div>
                      </div>

                      <CardContent className="space-y-2 p-4">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 capitalize">
                          {template.name.replace(/-/g, " ")}
                        </h3>

                        <Button
                          onClick={() => handleTemplateSelect(template)}
                          className="bg-primary w-full"
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Template Import Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to import the{" "}
              <span className="font-semibold capitalize">
                {selectedTemplate?.name.replace(/-/g, " ")}
              </span>{" "}
              template?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmImport}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Yes, Import Template"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start from Scratch Confirmation Dialog */}
      <AlertDialog
        open={showScratchConfirm}
        onOpenChange={setShowScratchConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start from Scratch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start from scratch? This will take you
              directly to the website builder with a blank canvas. You can still
              choose a template later if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStartFromScratch}>
              Yes, Start from Scratch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
