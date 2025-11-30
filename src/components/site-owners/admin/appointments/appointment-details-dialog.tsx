"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
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
import { toast } from "sonner";

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
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  useEffect(() => {
    if (currentAppointmentId && appointments.length > 0) {
      const index = appointments.findIndex(a => a.id === currentAppointmentId);
      if (index !== -1) {
        setCurrentAppointment(appointments[index]);
        setCurrentIndex(index);
      }
    }
  }, [currentAppointmentId, appointments]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || appointments.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, appointments.length]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newAppointment = appointments[newIndex];
      setCurrentIndex(newIndex);
      setCurrentAppointment(newAppointment);
      onAppointmentChange(newAppointment.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < appointments.length - 1) {
      const newIndex = currentIndex + 1;
      const newAppointment = appointments[newIndex];
      setCurrentIndex(newIndex);
      setCurrentAppointment(newAppointment);
      onAppointmentChange(newAppointment.id);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!currentAppointment) return;

    try {
      await updateAppointment.mutateAsync({
        id: currentAppointment.id,
        data: { status: newStatus as "pending" | "completed" | "cancelled" },
      });

      setCurrentAppointment(prev =>
        prev
          ? {
              ...prev,
              status: newStatus as "pending" | "completed" | "cancelled",
            }
          : null
      );
      toast.success("Appointment status updated successfully");
    } catch (error) {
      toast.error("Failed to update appointment status");
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

  if (!currentAppointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-visible bg-black/80 p-0 backdrop-blur-sm">
        {/* Navigation Arrows - Positioned outside the dialog */}
        {appointments.length > 1 && (
          <>
            {/* Left Arrow */}
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 -left-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </Button>

            {/* Right Arrow */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === appointments.length - 1}
              className="absolute top-1/2 -right-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </>
        )}

        <div className="relative max-h-[95vh] w-full overflow-y-auto rounded-lg bg-white shadow">
          {/* Header with navigation indicator */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold">Appointment Details</h2>
              {appointments.length > 1 && (
                <div className="text-xs text-gray-500">
                  {currentIndex + 1} of {appointments.length}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={currentAppointment.status}
                onValueChange={handleStatusChange}
                disabled={updateAppointment.isPending}
              >
                <SelectTrigger className="w-[140px]">
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
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Personal Information Grid */}
            <div className="mb-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {currentAppointment.full_name}
                  </p>
                </div>
              </div>

              {currentAppointment.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {currentAppointment.email}
                    </p>
                  </div>
                </div>
              )}

              {currentAppointment.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {currentAppointment.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="mb-3 text-base font-semibold">Appointment Info</h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(currentAppointment.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {formatTime(currentAppointment.time)}
                    </p>
                  </div>
                </div>

                {currentAppointment.reason && (
                  <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Reason</p>
                      <p className="font-medium text-gray-900">
                        {currentAppointment.reason.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            {currentAppointment.message && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">
                    Additional Notes
                  </h3>
                </div>
                <p className="rounded-lg bg-gray-50 p-4 text-sm whitespace-pre-wrap text-gray-700">
                  {currentAppointment.message}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-6 flex justify-between border-t pt-4 text-xs text-gray-500">
              <div>
                <span>Submitted: </span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(currentAppointment.created_at)}
                </span>
              </div>
              {currentAppointment.created_at !==
                currentAppointment.updated_at && (
                <div>
                  <span>Last Updated: </span>
                  <span className="font-medium text-gray-900">
                    {formatDateTime(currentAppointment.updated_at)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t pt-4">
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Delete Appointment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;
