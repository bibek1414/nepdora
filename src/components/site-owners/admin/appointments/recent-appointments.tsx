"use client";

import { useState } from "react";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Appointment } from "@/types/owner-site/admin/appointment";
import Link from "next/link";
import AppointmentDetailsDialog from "./appointment-details-dialog";

export default function RecentAppointments() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: appointmentsData,
    isLoading,
    error,
  } = useGetAppointments({
    page: 1,
    page_size: 5,
  });

  const handleRowClick = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setIsDialogOpen(true);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading recent appointments.</AlertDescription>
      </Alert>
    );
  }

  if (
    !appointmentsData ||
    !appointmentsData.results ||
    appointmentsData.results.length === 0
  ) {
    return (
      <Card>
        <CardTitle className="text-lg font-semibold">
          Recent Appointments
        </CardTitle>
        <CardContent>
          <div className="py-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No appointments found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Recent appointments will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Recent Appointments
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/admin/appointments"
              className="flex items-center gap-1"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsData.results.map((appointment: Appointment) => (
                  <TableRow
                    key={appointment.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(appointment.id)}
                  >
                    <TableCell className="font-medium capitalize">
                      {appointment.full_name}
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
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointments={appointmentsData.results}
        currentAppointmentId={selectedAppointmentId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAppointmentChange={setSelectedAppointmentId}
      />
    </>
  );
}
