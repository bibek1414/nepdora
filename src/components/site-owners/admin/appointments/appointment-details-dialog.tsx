"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Appointment } from "@/types/owner-site/admin/appointment";
import {
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/owner-site/admin/use-appointment";

interface AppointmentDetailsDialogProps {
  appointments: Appointment[];
  currentAppointmentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onAppointmentChange: (appointmentId: number) => void;
}

const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
  appointments,
  currentAppointmentId,
  isOpen,
  onClose,
  onAppointmentChange,
}) => {
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const currentIndex = appointments.findIndex(
    a => a.id === currentAppointmentId
  );
  const currentAppointment = appointments[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onAppointmentChange(appointments[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < appointments.length - 1) {
      onAppointmentChange(appointments[currentIndex + 1].id);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (currentAppointment) {
      updateAppointment.mutate({
        id: currentAppointment.id,
        data: { status: newStatus as "pending" | "completed" | "cancelled" },
      });
    }
  };

  const handleDelete = () => {
    if (
      currentAppointment &&
      confirm("Are you sure you want to delete this appointment?")
    ) {
      deleteAppointment.mutate(currentAppointment.id);
      onClose();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not set";
    return timeString;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

  if (!currentAppointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Appointment Details</DialogTitle>
            <div className="flex items-center gap-2">
              {/* Navigation */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm text-gray-600">
                  {currentIndex + 1} of {appointments.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex === appointments.length - 1}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("pending")}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("completed")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("cancelled")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Mark as Cancelled
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <Select
              value={currentAppointment.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-yellow-600" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Completed
                  </div>
                </SelectItem>
                <SelectItem value="cancelled">
                  <div className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                    Cancelled
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              Personal Information
            </h3>

            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-gray-900 capitalize">
                  {currentAppointment.full_name}
                </p>
              </div>
            </div>

            {currentAppointment.email && (
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{currentAppointment.email}</p>
                </div>
              </div>
            )}

            {currentAppointment.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{currentAppointment.phone}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Appointment Details</h3>

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-gray-900">
                  {formatDate(currentAppointment.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="text-gray-900">
                  {formatTime(currentAppointment.time)}
                </p>
              </div>
            </div>

            {currentAppointment.reason && (
              <div className="flex items-start gap-3">
                <Tag className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Reason</p>
                  <p className="text-gray-900">
                    {currentAppointment.reason.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          {currentAppointment.message && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">
                    Additional Notes
                  </h3>
                </div>
                <p className="rounded-lg bg-gray-50 p-4 whitespace-pre-wrap text-gray-700">
                  {currentAppointment.message}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Submitted</span>
              <span className="text-gray-900">
                {formatDateTime(currentAppointment.created_at)}
              </span>
            </div>
            {currentAppointment.created_at !==
              currentAppointment.updated_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-900">
                  {formatDateTime(currentAppointment.updated_at)}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;
