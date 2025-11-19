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
} from "lucide-react";
import {
  useGetTemplates,
  useImportTemplate,
  usePreviewTemplate,
} from "@/hooks/owner-site/admin/use-template";
import { Template } from "@/types/owner-site/admin/template";
import { useRouter } from "next/navigation";
import useDebouncer from "@/hooks/use-debouncer";

interface OnboardingStepThreeProps {
  websiteType: string;
  onBack: () => void;
}

export const OnboardingStepThree = ({
  websiteType,
  onBack,
}: OnboardingStepThreeProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [gridView, setGridView] = useState<"large" | "compact">("large");

  const debouncedSearchTerm = useDebouncer(searchTerm, 300);

  const {
    data: templatesData,
    isLoading,
    error,
  } = useGetTemplates({
    page: 1,
    page_size: 50,
    search: debouncedSearchTerm || undefined,
  });

  const { mutate: importTemplate, isPending } = useImportTemplate();
  const { openPreview } = usePreviewTemplate();

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowConfirmDialog(true);
  };

  const handleConfirmImport = () => {
    if (selectedTemplate) {
      importTemplate(selectedTemplate.id, {
        onSuccess: () => {
          setShowConfirmDialog(false);
          router.push("/admin");
        },
      });
    }
  };

  const handlePreview = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    openPreview(template.schema_name);
  };

  const handleStartFromScratch = () => {
    router.push("/admin");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

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
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <img src="/fulllogo.svg" />

            <div className="w-20"></div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white px-6 pb-4">
          <div className="h-1 w-full bg-gray-200">
            <div className="h-full w-full bg-blue-600 transition-all duration-300"></div>
          </div>
          <p className="mt-2 text-sm font-medium text-blue-600">Step 3</p>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                Select a website template
              </h1>
              <p className="text-gray-600">
                Unsure which template to pick? Don&apos;t worry, you can easily
                switch templates at any time without losing any of your content.
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={`${websiteType || "Search templates"}...`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="h-12 pr-10 pl-10"
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

              <div className="flex items-center gap-2">
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
                  onClick={handleStartFromScratch}
                  className="ml-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Start from scratch
                </Button>
              </div>
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
            ) : !templatesData?.results ||
              templatesData.results.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl">📋</div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                  No templates found
                </h2>
                <p className="mb-6 text-gray-600">
                  Try adjusting your search or start from scratch.
                </p>
                <Button onClick={handleStartFromScratch} variant="outline">
                  Start from scratch
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  gridView === "large"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {templatesData.results.map(template => (
                  <div key={template.id} className="group">
                    <Card className="overflow-hidden border-2 border-gray-200 transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
                      <div
                        className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100"
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

                        {/* Hover Overlay */}
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

                      <CardContent className="p-4">
                        <h3 className="mb-3 text-lg font-semibold text-gray-900 capitalize">
                          {template.name.replace(/-/g, " ")}
                        </h3>
                        <Button
                          onClick={() => handleTemplateSelect(template)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Dialog */}
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
              className="bg-blue-600 hover:bg-blue-700"
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
    </>
  );
};
