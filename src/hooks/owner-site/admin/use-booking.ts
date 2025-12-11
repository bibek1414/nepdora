import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "@/services/api/owner-sites/admin/booking";
import {
  PaginatedBookings,
  BookingFilters,
  Booking,
  BookingData,
} from "@/types/owner-site/admin/booking";

export const useGetBookings = (filters: BookingFilters = {}) => {
  return useQuery<PaginatedBookings>({
    queryKey: ["bookings", filters],
    queryFn: () => bookingAPI.getBookings(filters),
  });
};

export const useGetBooking = (id: number) => {
  return useQuery<Booking>({
    queryKey: ["booking", id],
    queryFn: () => bookingAPI.getBookingById(id),
    enabled: !!id,
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BookingData> }) =>
      bookingAPI.updateBooking(id, data),
    onSuccess: updatedBooking => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["booking", updatedBooking.id],
      });
    },
  });
};
