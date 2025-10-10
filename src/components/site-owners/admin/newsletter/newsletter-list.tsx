"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, UserPlus } from "lucide-react";
import { useNewsletters } from "@/hooks/owner-site/admin/use-newsletter";
import { format } from "date-fns";
import Pagination from "@/components/ui/pagination";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
export function NewsletterList() {
  const [page, setPage] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading, error } = useNewsletters(
    currentPage,
    pageSize,
    search
  );

  const debouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2 text-lg font-medium">
            Error loading newsletter subscriptions
          </p>
          <p className="text-muted-foreground text-sm">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;

  return (
    <div className="mx-auto space-y-6 px-6 py-5">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Newsletter Subscriptions
          </h1>
        </div>
      </div>
      <div className="mt-10 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search newsletter subscribers..."
            value={searchInput}
            onChange={handleSearchChange}
            className="border-gray-200 bg-white pr-10 pl-10 placeholder:text-gray-500 focus:border-gray-300 focus:ring-0"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {/* Newsletter Table */}
      {isLoading ? (
        <div className="rounded-lg border">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-600">
            <div className="col-span-1">S.N</div>
            <div className="col-span-5">Email Address</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Subscribed Date</div>
          </div>
          {/* Loading Skeletons */}
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-1">
                  <Skeleton className="h-5 w-8" />
                </div>
                <div className="col-span-5">
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : data && data.results.length > 0 ? (
        <>
          <div className="rounded-lg border border-gray-200 bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-600">
              <div className="col-span-1">S.N</div>
              <div className="col-span-5">Email Address</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Subscribed Date</div>
            </div>
            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {data.results.map((newsletter, index) => (
                <div
                  key={newsletter.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="col-span-1">
                    <span className="text-sm text-gray-600">
                      {(currentPage - 1) * pageSize + index + 1}
                    </span>
                  </div>
                  <div className="col-span-5">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {newsletter.email}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant={
                        newsletter.is_subscribed ? "default" : "secondary"
                      }
                      className={
                        newsletter.is_subscribed
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {newsletter.is_subscribed ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">
                      {format(new Date(newsletter.created_at), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={7}
          />
        </>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No newsletter subscriptions yet
          </h3>
          <p className="mb-4 text-gray-600">
            Your newsletter subscribers will appear here once they sign up
          </p>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
      )}
    </div>
  );
}
