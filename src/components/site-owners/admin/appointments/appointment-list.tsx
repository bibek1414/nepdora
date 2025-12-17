"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useGetAppointments,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/owner-site/admin/use-appointment";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Pagination from "@/components/ui/pagination";
import {
  Search,
  Calendar,
  Clock,
  MoreVertical,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  AppointmentFilters,
  Appointment,
} from "@/types/owner-site/admin/appointment";
import { CreateAppointmentReasonDialog } from "./appointment-reason-dialog";
import AppointmentDetailsDialog from "./appointment-details-dialog";
import Link from "next/link";

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

const AppointmentList = () => {
  const [filters, setFilters] = useState<AppointmentFilters>({
    page: 1,
    page_size: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Main list data
  const {
    data: appointmentsData,
    isLoading,
    error,
  } = useGetAppointments(filters);

  // Count queries for tabs
  const { data: totalCountData } = useGetAppointments({ page_size: 1 });
  const { data: pendingCountData } = useGetAppointments({
    status: "pending",
    page_size: 1,
  });
  const { data: completedCountData } = useGetAppointments({
    status: "completed",
    page_size: 1,
  });
  const { data: cancelledCountData } = useGetAppointments({
    status: "cancelled",
    page_size: 1,
  });

  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  // Update filters when status changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      status: statusFilter === "all" ? undefined : statusFilter,
    }));
  }, [statusFilter]);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentChange = (appointmentId: number) => {
    if (appointmentsData?.results) {
      const appointment = appointmentsData.results.find(
        (a: Appointment) => a.id === appointmentId
      );
      setSelectedAppointment(appointment || null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const statusTabs = [
    { id: "all", label: "All", count: totalCountData?.count || 0 },
    {
      id: "pending",
      label: "Pending",
      count: pendingCountData?.count || 0,
    },
    {
      id: "completed",
      label: "Completed",
      count: completedCountData?.count || 0,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: cancelledCountData?.count || 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
    };
    return (
      <Badge
        variant="outline"
        className={`font-medium capitalize ${styles[status] || ""}`}
      >
        {status}
      </Badge>
    );
  };

  const totalPages = Math.ceil(
    (appointmentsData?.count || 0) / (filters.page_size || 10)
  );
  const currentPage = filters.page || 1;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading appointments. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Appointments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your appointments
            </p>
          </div>
          <Button className="gap-2 bg-gray-900 text-white hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border-gray-200 bg-white pl-10 placeholder:text-gray-400 focus-visible:ring-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <Link href="/admin/appointments/reason">
                <Button
                  variant="outline"
                  className="border-gray-200 bg-transparent text-gray-700"
                >
                  Manage Reasons
                </Button>
              </Link>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex w-fit gap-1 rounded-lg bg-gray-100/80 p-1">
            {statusTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  statusFilter === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    statusFilter === tab.id
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-200/60 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border-none shadow-none">
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Contact
                  </TableHead>
                  <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Time
                  </TableHead>
                  <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Reason
                  </TableHead>
                  <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsData?.results?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointmentsData?.results.map((appointment: Appointment) => (
                    <TableRow
                      key={appointment.id}
                      className="cursor-pointer border-gray-100 transition-colors hover:bg-gray-50/50"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      <TableCell className="font-medium text-gray-900">
                        {appointment.full_name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="text-sm text-gray-600">
                            {appointment.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {appointment.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {formatDate(appointment.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {appointment.time || "--:--"}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {appointment.reason?.name || "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {(currentPage - 1) * (filters.page_size || 10) +
              ((appointmentsData?.results?.length || 0) > 0 ? 1 : 0)}{" "}
            to{" "}
            {Math.min(
              currentPage * (filters.page_size || 10),
              appointmentsData?.count || 0
            )}{" "}
            of {appointmentsData?.count || 0} appointments
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showFirstLast={false}
              maxVisiblePages={5}
            />
          )}
        </div>
      </div>

      {/* Appointment Details Dialog */}
      {appointmentsData?.results && (
        <AppointmentDetailsDialog
          appointments={appointmentsData.results}
          currentAppointmentId={selectedAppointment?.id || null}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onAppointmentChange={handleAppointmentChange}
        />
      )}
    </div>
  );
};

export default AppointmentList;
