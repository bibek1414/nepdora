"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetTemplates } from "@/hooks/owner-site/admin/use-template";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Pagination from "@/components/ui/pagination";
import { TemplateCard } from "./template-card";
import { Search, X, Layout } from "lucide-react";
import useDebouncer from "@/hooks/use-debouncer";
import { LoadingScreen } from "@/components/on-boarding/loading-screen/loading-screen";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TemplateList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "ecoomerce" | "services"
  >("all");
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const debouncedSearchTerm = useDebouncer(searchTerm, 300);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  const {
    data: templatesData,
    isLoading,
    isFetching,
    error,
  } = useGetTemplates({
    ...filters,
    page_size: 100, // Fetch more to allow frontend filtering
  });

  const filteredTemplates = (templatesData?.results || []).filter(template => {
    if (selectedType === "ecoomerce") {
      return template.template_category?.slug === "ecoomerce";
    }
    if (selectedType === "services") {
      return template.template_category?.slug !== "ecoomerce";
    }
    return true;
  });

  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const totalPages = Math.ceil(
    (templatesData?.count || 0) / (filters.page_size || 12)
  );
  const currentPage = filters.page || 1;

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="group">
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200/60 bg-white">
            <Skeleton className="aspect-4/3 w-full" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="flex shrink-0 gap-2">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        </div>

        {/* Search Bar and Type Filter */}
        <div className="mt-5 mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-12 pr-10 pl-10 text-base placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <Tabs
            value={selectedType}
            onValueChange={v => setSelectedType(v as any)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ecoomerce">Ecommerce</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Error loading templates. Please try again later.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : !filteredTemplates || filteredTemplates.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">📋</div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              {searchTerm || selectedType !== "all"
                ? "No matching templates found"
                : "No templates available"}
            </h2>
            <p className="mb-6 text-gray-600">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your filters or search."
                : "Templates will appear here when available."}
            </p>
            {(searchTerm || selectedType !== "all") && (
              <Button
                onClick={() => {
                  clearSearch();
                  setSelectedType("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onImportSuccess={() => setShowLoadingScreen(true)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
      <LoadingScreen isVisible={showLoadingScreen} />
    </div>
  );
};

export default TemplateList;
