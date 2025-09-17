"use client";

import { useState, useEffect, useCallback } from "react";
import { usePopupForms, usePopups } from "@/hooks/owner-site/admin/use-popup";
import { useDebouncer } from "@/hooks/use-debouncer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  Eye,
  FileText,
  User,
} from "lucide-react";
import { PopUpForm, PopUp } from "@/types/owner-site/admin/popup";
import { PopupFormFilters } from "@/types/owner-site/admin/popup";

const PopupFormList = () => {
  const [filters, setFilters] = useState<PopupFormFilters>({
    page: 1,
    page_size: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPopup, setSelectedPopup] = useState<string>("");

  // Use the custom debounce hook with 1 second delay
  const debouncedSearchTerm = useDebouncer(searchTerm, 1000);

  // Get popups for filter dropdown
  const { data: popupsData } = usePopups();

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1, // Reset to first page when searching
      search: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  // Update filters when popup filter changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      popup: selectedPopup ? parseInt(selectedPopup) : undefined,
    }));
  }, [selectedPopup]);

  const { data: formsData, isLoading, error } = usePopupForms(filters);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearPopupFilter = () => {
    setSelectedPopup("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getPopupTitle = (popupId: number) => {
    if (!popupsData) return `Popup #${popupId}`;
    const popup = popupsData.find((p: PopUp) => p.id === popupId);
    return popup ? popup.title : `Popup #${popupId}`;
  };

  const totalPages = Math.ceil(
    (formsData?.count || 0) / (filters.page_size || 10)
  );
  const currentPage = filters.page || 1;

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading popup forms. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!formsData || !formsData.results || formsData.results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Popup Form Submissions
            </CardTitle>
            <CardDescription>
              Manage popup form submissions and leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm || selectedPopup
                  ? "No matching forms found"
                  : "No form submissions found"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || selectedPopup
                  ? "Try adjusting your search criteria."
                  : "When visitors submit popup forms, they will appear here."}
              </p>
              {(searchTerm || selectedPopup) && (
                <div className="mt-4 flex justify-center gap-2">
                  {searchTerm && (
                    <Button variant="outline" onClick={clearSearch} size="sm">
                      Clear Search
                    </Button>
                  )}
                  {selectedPopup && (
                    <Button
                      variant="outline"
                      onClick={clearPopupFilter}
                      size="sm"
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900">
              Popup Form Submissions
            </h1>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Badge variant="secondary" className="self-start sm:self-center">
              {formsData.count} total submissions
            </Badge>
            {(searchTerm || selectedPopup) && (
              <div className="text-sm text-gray-500">
                {searchTerm && `Showing results for '${searchTerm}'`}
                {searchTerm && selectedPopup && " • "}
                {selectedPopup &&
                  `Filtered by ${getPopupTitle(parseInt(selectedPopup))}`}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 z-50 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, phone, or address..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pr-10 pl-10 placeholder:text-gray-400 focus:outline-none"
          />
          {searchTerm && (
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

        {/* Table */}
        <Card className="border-none">
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Popup</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formsData.results.map((form: PopUpForm) => (
                    <TableRow
                      key={form.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium capitalize">
                              {form.name || "Anonymous"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {form.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span className="max-w-[200px] truncate">
                                {form.email}
                              </span>
                            </div>
                          )}
                          {form.phone_number && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{form.phone_number}</span>
                            </div>
                          )}
                          {!form.email && !form.phone_number && (
                            <span className="text-sm text-gray-400">
                              No contact info
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {form.address ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span
                              className="max-w-[200px] truncate"
                              title={form.address}
                            >
                              {form.address}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getPopupTitle(form.popup)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(form.created_at)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={7}
          />
        )}

        {/* Results Summary */}
        {formsData.results.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {(currentPage - 1) * (filters.page_size || 10) + 1} to{" "}
            {Math.min(currentPage * (filters.page_size || 10), formsData.count)}{" "}
            of {formsData.count} submissions
            {(searchTerm || selectedPopup) && <>{" matching your filters"}</>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupFormList;
