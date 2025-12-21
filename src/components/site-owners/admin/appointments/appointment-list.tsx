"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Hourglass,
  XCircle,
  X,
} from "lucide-react";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
import { Appointment } from "@/types/owner-site/admin/appointment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableWrapper,
  TableUserCell,
  TableActionButtons,
} from "@/components/ui/custom-table";
import AppointmentDetailsDialog from "./appointment-details-dialog";
import { useUpdateAppointment } from "@/hooks/owner-site/admin/use-appointment";
import { toast } from "sonner";

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

const APPOINTMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

type StatusFilter = "all" | "pending" | "completed" | "cancelled";

export default function AppointmentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Use API hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);

  const updateAppointment = useUpdateAppointment();

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

  const handleStatusChange = async (
    appointmentId: number,
    newStatus: string
  ) => {
    try {
      await updateAppointment.mutateAsync({
        id: appointmentId,
        data: { status: newStatus as any },
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Reset pagination when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const statusTabs = [
    {
      id: "all" as StatusFilter,
      label: "All",
      icon: Calendar,
      count: appointmentsData?.count || 0,
    },
    {
      id: "pending" as StatusFilter,
      label: "Pending",
      icon: Hourglass,
      count: 0,
    },
    {
      id: "confirmed" as StatusFilter,
      label: "Confirmed",
      icon: CheckCircle2,
      count: 0,
    },
    {
      id: "completed" as StatusFilter,
      label: "Completed",
      icon: CheckCircle2,
      count: 0,
    },
    {
      id: "cancelled" as StatusFilter,
      label: "Cancelled",
      icon: XCircle,
      count: 0,
    },
  ];

  // Calculate counts for each status
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      all: appointmentsData?.count || 0,
    };
    appointmentsData?.results?.forEach(apt => {
      const status = apt.status.toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
      // Also count "confirmed" if status is something else
      if (status === "confirmed") {
        counts.confirmed = (counts.confirmed || 0) + 1;
      }
    });
    return counts;
  }, [appointmentsData]);

  const tabsWithCounts = statusTabs.map(tab => ({
    ...tab,
    count: statusCounts[tab.id] || 0,
  }));

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleRowClick = (item: Appointment, event: React.MouseEvent) => {
    // Check if the click was inside the status dropdown
    if (
      dropdownRef.current &&
      dropdownRef.current.contains(event.target as Node)
    ) {
      return; // Don't open the dialog if clicking on the dropdown
    }
    setSelectedAppointmentId(item.id);
    setIsDialogOpen(true);
  };

  // Filter by status on client side
  const filteredBookings = React.useMemo(() => {
    if (!appointmentsData?.results) return [];
    if (statusFilter === "all") return appointmentsData.results;
    return appointmentsData.results.filter(
      apt => apt.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [appointmentsData?.results, statusFilter]);

  const totalPages = Math.ceil((filteredBookings.length || 0) / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Page Header */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#003d79]">Appointments</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 px-3 text-xs font-normal text-black/60 hover:bg-black/2 hover:text-black"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Status Filter Buttons - Rounded Button Design like Order List */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabsWithCounts.map(tab => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setSearchTerm("");
                  }}
                  className={`rounded-full px-4 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-black/5 text-black/60 hover:bg-black/10"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={cn(
                        "ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-medium",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-black/10 text-black/40"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white">
          <div className="p-0">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
                <p className="text-xs text-black/40">Loading data...</p>
              </div>
            ) : paginatedBookings.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <p className="text-sm text-black/60">No appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-black/5">
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Customer
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Date & Time
                      </TableHead>

                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookings.map(item => (
                      <TableRow
                        key={item.id}
                        className="group border-b border-black/5 transition-colors hover:bg-black/2"
                        onClick={e => handleRowClick(item, e)}
                      >
                        <TableCell className="px-6 py-4">
                          <TableUserCell
                            title={item.full_name}
                            subtitle={item.email}
                            fallback={getInitials(item.full_name)}
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-normal text-black">
                              {formatDate(item.date)}
                            </span>
                            <span className="text-[10px] text-black/40">
                              {item.time || "Time not set"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div
                            ref={dropdownRef}
                            onClick={e => e.stopPropagation()}
                          >
                            <Select
                              value={item.status.toLowerCase()}
                              onValueChange={value =>
                                handleStatusChange(item.id, value)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px] border-black/5 bg-black/5 text-xs font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {APPOINTMENT_STATUS_OPTIONS.map(option => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-xs"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && paginatedBookings.length > 0 && (
            <div className="flex items-center justify-between border-t border-black/5 bg-white px-6 py-4">
              <div className="text-[10px] text-black/40">
                Showing {paginatedBookings.length} results
              </div>
              <SimplePagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>

        {/* Appointment Details Modal */}
        <AppointmentDetailsDialog
          appointments={appointmentsData?.results || []}
          currentAppointmentId={selectedAppointmentId}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onAppointmentChange={setSelectedAppointmentId}
        />
      </div>
    </div>
  );
}
