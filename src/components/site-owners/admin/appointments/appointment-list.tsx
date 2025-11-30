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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const {
    data: appointmentsData,
    isLoading,
    error,
  } = useGetAppointments(filters);
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

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

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    updateAppointment.mutate({
      id: appointmentId,
      data: { status: newStatus as "pending" | "completed" | "cancelled" },
    });
  };

  const handleDelete = (appointmentId: number) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment.mutate(appointmentId);
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

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not set";
    return timeString;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const totalPages = Math.ceil(
    (appointmentsData?.count || 0) / (filters.page_size || 10)
  );
  const currentPage = filters.page || 1;

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
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
            Error loading appointments. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state with full UI
  if (
    !appointmentsData ||
    !appointmentsData.results ||
    appointmentsData.results.length === 0
  ) {
    return (
      <div className="mx-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Appointments
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <CreateAppointmentReasonDialog />
              <Badge variant="secondary">0 total appointments</Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pr-10 pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Empty state message */}
          <Card>
            <CardContent>
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {searchTerm || statusFilter !== "all"
                    ? "No matching appointments found"
                    : "No appointments found"}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters."
                    : "When customers book appointments, they will appear here."}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleClearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-black">Appointments</h1>
          <p className="text-muted-foreground">
            Manage and track your appointments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or phone..."
                  className="pl-9 placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Link href="/admin/appointments/reason">Manage Reason</Link>
              </Button>
              <CreateAppointmentReasonDialog />
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="flex items-center gap-2"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === "cancelled" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("cancelled")}
            >
              Cancelled
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="border-none">
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentsData.results.map((appointment: Appointment) => (
                    <TableRow
                      key={appointment.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50/50"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      <TableCell className="font-medium capitalize">
                        {appointment.full_name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{appointment.email}</div>
                          <div className="text-gray-500">
                            {appointment.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {formatDate(appointment.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {formatTime(appointment.time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.reason?.name || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <div onClick={e => e.stopPropagation()}>
                          <Select
                            value={appointment.status}
                            onValueChange={value =>
                              handleStatusChange(appointment.id, value)
                            }
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
        {appointmentsData.results.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {(currentPage - 1) * (filters.page_size || 10) + 1} to{" "}
            {Math.min(
              currentPage * (filters.page_size || 10),
              appointmentsData.count
            )}{" "}
            of {appointmentsData.count} appointments
          </div>
        )}
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
