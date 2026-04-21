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
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateCard } from "../site-owners/admin/templates/template-card";
import { useTemplates } from "@/hooks/super-admin/components/use-templates";
import { Template } from "@/types/super-admin/components/template";
import { useRouter } from "next/navigation";
import useDebouncer from "@/hooks/use-debouncer";
import { LoadingScreen } from "@/components/on-boarding/loading-screen/loading-screen";

import {
  useImportTemplate,
  usePreviewTemplate,
} from "@/hooks/owner-site/admin/use-template";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types/auth/auth";

interface OnboardingStepTwoProps {
  websiteType: string;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  user: User;
}

export const OnboardingStepTwo = ({
  websiteType,
  onBack,
  currentStep,
  totalSteps,
  user,
}: OnboardingStepTwoProps) => {
  const router = useRouter();
  const { tokens } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [showScratchConfirm, setShowScratchConfirm] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [gridView, setGridView] = useState<"large" | "compact">("large");

  const debouncedSearchTerm = useDebouncer(searchTerm, 300);

  // If ecommerce, we pass it to the API.
  // If services, we fetch all and filter in frontend (since API doesn't support "exclude")
  const {
    data: templatesData,
    isLoading,
    error,
  } = useTemplates({
    page: 1,
    pageSize: 100, // Fetch more to allow frontend filtering for "services"
    category: websiteType === "ecoomerce" ? "ecoomerce" : undefined,
    search: debouncedSearchTerm || undefined,
  });

  const templates = (templatesData?.results || []).filter(template => {
    if (websiteType === "services") {
      // Show everything EXCEPT ecommerce
      return template.template_category?.slug !== "ecoomerce";
    }
    return true; // Already filtered by API for ecommerce
  });

  const handleStartFromScratchClick = () => {
    setShowScratchConfirm(true);
  };

  const handleConfirmStartFromScratch = () => {
    setShowScratchConfirm(false);
    setShowLoadingScreen(true);

    setTimeout(() => {
      router.push(`/builder/${user.sub_domain}`);
    }, 5000);
  };

  const clearSearch = () => {
    setSearchTerm("");
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

      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full px-5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Button>
          <img
            src="/nepdora-logooo.svg"
            alt="Nepdora Logo"
            className="h-8 w-auto md:absolute md:left-1/2 md:-translate-x-1/2"
          />
          <Button
            variant="ghost"
            className="rounded-full px-5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => {
              setShowLoadingScreen(true);
              setTimeout(() => router.push("/admin"), 2000);
            }}
          >
            Skip for now
          </Button>
        </header>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-primary text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-xs text-slate-400">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
          <div className="mx-auto max-w-7xl">
            {/* Template Intro Section */}
            <div className="mb-12 text-center">
              <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <span>Step 2: Choose your look</span>
              </div>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                Pick a template that fits your style
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-500">
                Browse our collection of premium templates. Each one is fully
                customizable and mobile-responsive.
              </p>
            </div>

            {/* Controls Bar */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search templates by name or category..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="focus:border-primary/50 focus:ring-primary/20 h-12 border-slate-200 bg-white pr-12 pl-12 placeholder:text-black/40"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleStartFromScratchClick}
                  className="font-medium transition-all"
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
              <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
                <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                <p className="font-medium">Error loading templates</p>
                <p className="text-sm">
                  Please try again later or contact support.
                </p>
              </div>
            ) : !templates || templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                  <LayoutGrid className="h-10 w-10 text-slate-300" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">
                  No templates found
                </h2>
                <p className="mb-8 max-w-md text-slate-500">
                  {searchTerm
                    ? `We couldn't find any templates matching "${searchTerm}". Try a different term or browse our main categories.`
                    : "We're currently preparing some amazing templates for you. Check back soon!"}
                </p>
                <Button
                  onClick={handleStartFromScratchClick}
                  variant="default"
                  className="shadow-primary/20 shadow-lg"
                >
                  Start from scratch instead
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-8",
                  gridView === "large"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 lg:grid-cols-4"
                )}
              >
                {templates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template as any}
                    onImportSuccess={() => setShowLoadingScreen(true)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

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
