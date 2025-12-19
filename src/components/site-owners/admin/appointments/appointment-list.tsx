"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableWrapper,
  TableUserCell,
  TableActionButtons,
} from "@/components/ui/custom-table";
import { cn } from "@/lib/utils";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
import { Appointment } from "@/types/owner-site/admin/appointment";

const ITEMS_PER_PAGE = 10;

// Helper to get initials (kept for fallback usage in CustomTable if needed, though we pass it as fallback prop)
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status.toLowerCase()] ||
          "border-slate-200 bg-slate-50 text-slate-600"
      )}
    >
      {status}
    </span>
  );
};

const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-slate-600">
        Page {currentPage} of {Math.max(1, totalPages)}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

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

export default function AppointmentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(
    null
  );

  // Use API hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);

  const {
    data: appointmentsData,
    isLoading,
    refetch,
  } = useGetAppointments({
    page,
    page_size: ITEMS_PER_PAGE,
    search: debouncedSearchTerm || undefined,
  });

  const handleRefresh = () => {
    refetch();
  };

  // Reset pagination when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleRowClick = (item: Appointment) => {
    setSelectedBooking(item);
    setIsDialogOpen(true);
  };

  const totalPages = Math.ceil((appointmentsData?.count || 0) / ITEMS_PER_PAGE);
  const paginatedBookings = appointmentsData?.results || [];

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-500">
      <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Appointments
            </h1>
            <p className="text-sm text-slate-500">
              See your appointments. {appointmentsData?.count || 0} appointments
              available.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 border-slate-200 bg-white"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Search Toolbar */}
        <div className="flex justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 border-slate-200 bg-white pl-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Main Content Area - New Table Implementation */}
        <TableWrapper>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-slate-500">Loading appointments...</div>
            </div>
          ) : paginatedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Calendar className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">
                No appointments found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your filters or search.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Customer
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Date & Time
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Reason
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.map(item => (
                  <TableRow
                    key={item.id}
                    className="group cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                    onClick={() => handleRowClick(item)}
                  >
                    <TableCell className="px-6 py-4">
                      <TableUserCell
                        fallback={getInitials(item.full_name)}
                        title={item.full_name}
                        subtitle={item.email}
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {formatDate(item.date)}
                        </span>
                        <span className="text-xs font-normal text-slate-500">
                          {item.time || "Time not set"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md border border-slate-100 bg-slate-50/50 px-2 py-1 text-xs font-medium text-slate-600">
                        {item.reason?.name || "General"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="border-l-0 px-6 py-4">
                      <TableActionButtons
                        onView={() => handleRowClick(item)}
                        onEdit={() => {
                          // Future edit logic
                          console.log("Edit", item.id);
                        }}
                        onDelete={() => {
                          // Future delete logic
                          console.log("Delete", item.id);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Footer / Pagination integrated inside wrapper or outside? 
                Design usually puts pagination outside or at bottom. 
                I will put it inside the wrapper at the bottom.
            */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
            <div className="text-xs font-medium text-slate-500">
              Showing{" "}
              <span className="text-slate-900">{paginatedBookings.length}</span>{" "}
              results
            </div>
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </TableWrapper>

        {/* Appointment Details Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Manage booking status and details.
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="mt-4 space-y-6">
                <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                    {getInitials(selectedBooking.full_name)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-semibold text-slate-900">
                      {selectedBooking.full_name}
                    </h4>
                    <div className="text-sm text-slate-500">
                      {selectedBooking.email}
                    </div>
                  </div>
                  <StatusBadge status={selectedBooking.status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Date
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {formatDate(selectedBooking.date)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Time
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {selectedBooking.time || "--:--"}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Service/Reason
                  </label>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                    {selectedBooking.reason?.name || "General"}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    Edit Booking
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
