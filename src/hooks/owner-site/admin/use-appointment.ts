import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentAPI } from "@/services/api/owner-sites/admin/appointment";
import {
  AppointmentFilters,
  AppointmentFormData,
} from "@/types/owner-site/admin/appointment";
import { toast } from "sonner";

// Get appointments with filters
export const useGetAppointments = (filters: AppointmentFilters = {}) => {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => appointmentAPI.getAppointments(filters),
    staleTime: 30000, // 30 seconds
  });
};

// Get appointment reasons
export const useGetAppointmentReasons = () => {
  return useQuery({
    queryKey: ["appointment-reasons"],
    queryFn: () => appointmentAPI.getAppointmentReasons(),
    staleTime: 300000,
  });
};

// Submit appointment form (for public-facing form)
export const useSubmitAppointmentForm = (siteUser: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentFormData) =>
      appointmentAPI.createAppointment(data),
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to book appointment");
    },
  });
};

// Update appointment (admin only)
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<AppointmentFormData>;
    }) => appointmentAPI.updateAppointment(id, data),
    onSuccess: () => {
      toast.success("Appointment updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update appointment");
    },
  });
};

// Delete appointment (admin only)
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentAPI.deleteAppointment(id),
    onSuccess: () => {
      toast.success("Appointment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete appointment");
    },
  });
};
