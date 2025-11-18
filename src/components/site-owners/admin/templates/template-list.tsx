"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetTemplates } from "@/hooks/owner-site/admin/use-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Pagination from "@/components/ui/pagination";
import { TemplateCard } from "./template-card";
import { Search, X, Layout } from "lucide-react";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const TemplateList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  const { data: templatesData, isLoading, error } = useGetTemplates(filters);

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
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto mb-4 h-12 w-96" />
            <Skeleton className="mx-auto h-6 w-64" />
          </div>
          <div className="mb-8">
            <Skeleton className="mx-auto h-12 w-full max-w-md" />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading templates. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (
    !templatesData ||
    !templatesData.results ||
    templatesData.results.length === 0
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Choose From Our Templates
            </h1>
            <p className="text-lg text-gray-600">
              Select a template to get started quickly
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-md">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pr-10 pl-10 placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">📋</div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              {searchTerm
                ? "No matching templates found"
                : "No templates available"}
            </h2>
            <p className="mb-6 text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Templates will appear here when available."}
            </p>
            {searchTerm && (
              <Button onClick={clearSearch} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Choose From {templatesData.count}+ Templates
          </h1>
          <p className="text-lg text-gray-600">
            Select a template to get started quickly
          </p>

          {searchTerm && (
            <div className="mt-4">
              <Badge variant="secondary" className="px-4 py-1 text-sm">
                Showing results for &apos;{searchTerm}&apos;
              </Badge>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-12 max-w-md">
          <div className="relative">
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
        </div>

        {/* Templates Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templatesData.results.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;
