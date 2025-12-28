"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Calendar, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useBookingData,
  useTourBookingsData,
} from "@/hooks/owner-site/admin/use-collections";
import { CollectionData } from "@/types/owner-site/admin/collection";

const ITEMS_PER_PAGE = 10;

const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 px-6 py-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="h-8 w-8 rounded-md"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-black/60">
        Page {currentPage} of {Math.max(1, totalPages)}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 rounded-md"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface BookingsClientProps {
  subDomain?: string;
}

export default function BookingsClient({ subDomain }: BookingsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLicenseImage, setSelectedLicenseImage] = useState<
    string | null
  >(null);
  const isBatoma = subDomain === "batoma";

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const bookingFilters: Record<string, string> | undefined = {
    ...(debouncedSearch && { search: debouncedSearch }),
    page: page.toString(),
    page_size: ITEMS_PER_PAGE.toString(),
  };

  const { data: bookingsData, isLoading: loadingBookings } =
    useBookingData(bookingFilters);
  const { data: tourBookingsData, isLoading: loadingTourBookings } =
    useTourBookingsData(bookingFilters);

  const isLoading = loadingBookings || loadingTourBookings;

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "—";

  // Get current data and counts
  const currentData = useMemo(() => {
    const bookingResults = (bookingsData?.results as CollectionData[]) || [];
    const tourBookingResults =
      (tourBookingsData?.results as CollectionData[]) || [];
    // Combine both booking types and sort by created_at descending (newest first)
    return [...bookingResults, ...tourBookingResults].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }, [bookingsData, tourBookingsData]);

  const totalCount = useMemo(() => {
    return (bookingsData?.count || 0) + (tourBookingsData?.count || 0);
  }, [bookingsData, tourBookingsData]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (!isBatoma) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-[#003d79]">Bookings</h1>
          </div>
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-sm text-black/60">
              Bookings are only available for Batoma subdomain.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Page Title */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">Bookings</h1>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center justify-end gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
              <p className="text-xs text-black/40">Loading data...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="text-sm text-black/60">No bookings found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-black/5">
                    <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                      Customer
                    </TableHead>
                    <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                      Service Details
                    </TableHead>
                    <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                      Date
                    </TableHead>
                    <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                      Number of Persons
                    </TableHead>
                    <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                      License
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item, index) => {
                    const bookingData = item.data || {};
                    const rideDate =
                      bookingData["ride date"] || bookingData["tour date"];
                    const returnDate = bookingData["return date"];
                    const phoneNumber = bookingData["phone number"];
                    // Handle both email field names (email vs Email)
                    const email = bookingData.email || bookingData.Email;
                    // Handle both package name field names (pakage name vs package name)
                    const packageName =
                      bookingData["pakage name"] || bookingData["package name"];
                    // Handle both number of persons field names (number of persons vs group size)
                    const numberOfPersons =
                      bookingData["number of persons"] ||
                      bookingData["group size"];
                    const licenseImage = bookingData["license image"];

                    return (
                      <TableRow
                        key={item.id || index}
                        className="border-b border-black/5 transition-colors hover:bg-black/2"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-normal text-black capitalize">
                              {bookingData.name || "—"}
                            </span>
                            {email && (
                              <span className="text-xs text-black/50">
                                {email}
                              </span>
                            )}
                            {phoneNumber && (
                              <span className="text-xs text-black/50">
                                {phoneNumber}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            {bookingData["vehicle name"] && (
                              <span className="text-xs text-black/60">
                                {bookingData["vehicle name"]}
                              </span>
                            )}
                            {packageName && (
                              <span className="text-xs text-black/60">
                                {packageName}
                              </span>
                            )}
                            {bookingData["ride type"] && (
                              <span className="text-xs text-black/40 capitalize">
                                {bookingData["ride type"]}
                              </span>
                            )}
                            {bookingData.price && (
                              <span className="text-xs font-medium text-black/60">
                                Rs. {bookingData.price}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            {rideDate && (
                              <span className="text-xs text-black/60">
                                {formatDate(rideDate)}
                              </span>
                            )}
                            {returnDate && (
                              <span className="text-xs text-black/40">
                                Return: {formatDate(returnDate)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-xs text-black/50">
                            {numberOfPersons || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {licenseImage ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSelectedLicenseImage(licenseImage)
                              }
                              className="h-8 text-xs"
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Button>
                          ) : (
                            <span className="text-xs text-black/40">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {!isLoading && currentData.length > 0 && (
                <SimplePagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>

        {/* License Image Dialog */}
        <Dialog
          open={!!selectedLicenseImage}
          onOpenChange={open => !open && setSelectedLicenseImage(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>License Image</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedLicenseImage && (
                <img
                  src={selectedLicenseImage}
                  alt="License"
                  className="h-auto w-full rounded-lg"
                  onError={e => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/placeholder-image.png";
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
