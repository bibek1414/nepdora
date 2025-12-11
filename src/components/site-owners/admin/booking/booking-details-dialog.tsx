import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { Booking } from "@/types/owner-site/admin/booking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateBooking } from "@/hooks/owner-site/admin/use-booking";
import { toast } from "sonner";

interface BookingDetailsDialogProps {
  bookings: Booking[];
  currentBookingId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingChange: (bookingId: number) => void;
}

const BookingDetailsDialog = ({
  bookings,
  currentBookingId,
  isOpen,
  onClose,
  onBookingChange,
}: BookingDetailsDialogProps) => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: updateBooking, isPending: isUpdating } = useUpdateBooking();

  useEffect(() => {
    if (currentBookingId && bookings.length > 0) {
      const bookingIndex = bookings.findIndex(
        booking => booking.id === currentBookingId
      );
      if (bookingIndex !== -1) {
        setCurrentBooking(bookings[bookingIndex]);
        setCurrentIndex(bookingIndex);
      }
    }
  }, [currentBookingId, bookings]);

  const onStatusChange = (id: number, status: string) => {
    if (!currentBooking) return;

    updateBooking(
      {
        id,
        data: {
          ...currentBooking.data,
          status: status as any,
        },
      },
      {
        onSuccess: updatedBooking => {
          toast.success("Booking status updated");
          // Update local state if needed for immediate reflection,
          // but invalidateQueries in hook should handle it if parent refreshes or we rely on that.
          // However, since we are inside the dialog and 'bookings' prop is passed from parent,
          // the parent list needs to refresh. The hook invalidates 'bookings' so the parent should refetch.
          // But we also need to update the local 'currentBooking' to show the new status immediately if strict sync is needed.
          setCurrentBooking(prev =>
            prev
              ? { ...prev, data: { ...prev.data, status: status as any } }
              : null
          );
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      }
    );
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || bookings.length <= 1) return;

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
  }, [isOpen, currentIndex, bookings.length]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newBooking = bookings[newIndex];
      setCurrentIndex(newIndex);
      setCurrentBooking(newBooking);
      onBookingChange(newBooking.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < bookings.length - 1) {
      const newIndex = currentIndex + 1;
      const newBooking = bookings[newIndex];
      setCurrentIndex(newIndex);
      setCurrentBooking(newBooking);
      onBookingChange(newBooking.id);
    }
  };

  if (!currentBooking) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-visible bg-black/80 p-0 backdrop-blur-sm">
        {/* Navigation Arrows - Positioned outside the dialog */}
        {bookings.length > 1 && (
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
              disabled={currentIndex === bookings.length - 1}
              className="absolute top-1/2 -right-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </>
        )}

        <div className="relative max-h-[95vh] w-full overflow-y-auto rounded-lg bg-white shadow">
          {/* Header with navigation indicator */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Booking #{currentBooking.id}
                </h2>
                <p className="text-sm text-gray-500">
                  Booked on {formatDate(currentBooking.created_at)}
                </p>
              </div>
              {bookings.length > 1 && (
                <div className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-500">
                  {currentIndex + 1} of {bookings.length}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Booking Details Section */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-600" />
                <h3 className="text-base font-semibold text-gray-900">
                  Booking Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Service */}
                {currentBooking.data["ride type"] && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Service
                    </label>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {currentBooking.data["ride type"]}
                      </p>
                    </div>
                  </div>
                )}

                {/* Vehicle Name */}
                {currentBooking.data["vehicle name"] && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Vehicle Name
                    </label>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {currentBooking.data["vehicle name"]}
                      </p>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Requested Date
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-900">
                          Start:{" "}
                          {currentBooking.data["ride date"]
                            ? formatDate(currentBooking.data["ride date"])
                            : "N/A"}
                        </p>
                        {currentBooking.data["return date"] && (
                          <p className="text-sm text-gray-900">
                            End:{" "}
                            {formatDate(currentBooking.data["return date"])}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Status
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Select
                        value={currentBooking.data.status || "pending"}
                        onValueChange={value =>
                          onStatusChange(currentBooking.id, value)
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[180px] capitalize">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* License Image */}
                {currentBooking.data["license image"] && (
                  <div className="col-span-1 border-t pt-4 md:col-span-2">
                    <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      License Image
                    </label>
                    <div className="mt-2 overflow-hidden rounded-lg border bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentBooking.data["license image"]}
                        alt="Driving License"
                        className="h-auto max-h-[400px] w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6 border-t pt-6">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="text-base font-semibold text-gray-900">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Full Name
                  </label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {currentBooking.data.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                {currentBooking.data.email && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Email Address
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900">
                          {currentBooking.data.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {currentBooking.data["phone number"] && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Phone Number
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900">
                          {currentBooking.data["phone number"]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!currentBooking.data.email &&
                  !currentBooking.data["phone number"] && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 italic md:col-span-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>No contact information provided</span>
                    </div>
                  )}
              </div>
            </div>

            {/* Message Section */}
            <div className="mb-6 border-t pt-6">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  Message
                </h3>
              </div>

              {currentBooking.data.content ? (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900">
                      {currentBooking.data.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                  <MessageSquare className="h-4 w-4" />
                  <span>No message provided</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
