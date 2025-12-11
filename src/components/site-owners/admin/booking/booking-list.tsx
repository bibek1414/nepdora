"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetBookings } from "@/hooks/owner-site/admin/use-booking";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Pagination from "@/components/ui/pagination";
import BookingDetailsDialog from "./booking-details-dialog";
import { Search, Calendar, X, Briefcase, CheckCircle } from "lucide-react";
import { BookingFilters, Booking } from "@/types/owner-site/admin/booking";

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

const BookingList = () => {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    page_size: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1, // Reset to first page when searching
      search: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  const { data: bookingsData, isLoading, error } = useGetBookings(filters);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleBookingChange = (bookingId: number) => {
    if (bookingsData?.results) {
      const booking = bookingsData.results.find(
        (b: Booking) => b.id === bookingId
      );
      setSelectedBooking(booking || null);
    }
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

  const totalPages = Math.ceil(
    (bookingsData?.count || 0) / (filters.page_size || 10)
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
            Error loading bookings. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (
    !bookingsData ||
    !bookingsData.results ||
    bookingsData.results.length === 0
  ) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm
                  ? "No matching bookings found"
                  : "No bookings found"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "When customers make bookings, they will appear here."}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={clearSearch}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="space-y-4">
        {/* Header */}

        <div className="relative w-1/4">
          <Search className="absolute top-1/2 left-3 z-50 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, or service..."
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
                    <TableHead>Service</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingsData.results.map((booking: Booking) => (
                    <TableRow
                      key={booking.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50/50"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium capitalize">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          {booking.data["ride type"] || "General Booking"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium capitalize">
                          {booking.data.name}
                        </div>
                        {booking.data.email && (
                          <div className="text-xs text-gray-500">
                            {booking.data.email}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {booking.data["ride date"]
                            ? formatDate(booking.data["ride date"])
                            : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.data.status ? (
                          <Badge className="capitalize">
                            {booking.data.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(booking.created_at)}
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
        {bookingsData.results.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {(currentPage - 1) * (filters.page_size || 10) + 1} to{" "}
            {Math.min(
              currentPage * (filters.page_size || 10),
              bookingsData.count
            )}{" "}
            of {bookingsData.count} bookings
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}

        {/* Booking Details Dialog */}
        <BookingDetailsDialog
          bookings={bookingsData?.results || []}
          currentBookingId={selectedBooking?.id || null}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onBookingChange={handleBookingChange}
        />
      </div>
    </div>
  );
};

export default BookingList;
