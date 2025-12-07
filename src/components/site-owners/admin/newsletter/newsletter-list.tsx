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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto">
      <div className="space-y-4">
        {/* Header */}

        <div className="relative w-1/4">
          <Search className="absolute top-1/2 left-3 z-50 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search newsletter subscribers..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pr-10 pl-10 placeholder:text-gray-400 focus:outline-none"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Newsletter Table */}
        <Card className="border-none">
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : data && data.results.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.N</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.results.map((newsletter, index) => (
                        <TableRow
                          key={newsletter.id}
                          className="transition-colors hover:bg-gray-50/50"
                        >
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {(currentPage - 1) * pageSize + index + 1}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {newsletter.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                newsletter.is_subscribed
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                newsletter.is_subscribed
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {newsletter.is_subscribed ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {format(
                                new Date(newsletter.created_at),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      showFirstLast={true}
                      maxVisiblePages={7}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
