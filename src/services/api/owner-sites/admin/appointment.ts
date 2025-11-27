import {
  Appointment,
  AppointmentFormData,
  PaginatedAppointments,
  AppointmentFilters,
  AppointmentReason,
} from "@/types/owner-site/admin/appointment";
import { getApiBaseUrl } from "@/config/site";

export const appointmentAPI = {
  // Get all appointments with filters
  getAppointments: async (
    filters: AppointmentFilters = {}
  ): Promise<PaginatedAppointments> => {
    const BASE_API_URL = getApiBaseUrl();

    const {
      page = 1,
      page_size = 10,
      search,
      status,
      date_from,
      date_to,
      time,
    } = filters;

    const url = new URL(`${BASE_API_URL}/api/appointments/`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("page_size", page_size.toString());

    if (search && search.trim()) {
      url.searchParams.append("search", search.trim());
    }
    if (status) {
      url.searchParams.append("status", status);
    }
    if (date_from) {
      url.searchParams.append("date_from", date_from);
    }
    if (date_to) {
      url.searchParams.append("date_to", date_to);
    }
    if (time) {
      url.searchParams.append("time", time);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch appointments: ${response.status}`);
    }

    return await response.json();
  },

  // Create a new appointment
  createAppointment: async (
    appointmentData: AppointmentFormData
  ): Promise<Appointment> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(`${BASE_API_URL}/api/appointments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create appointment: ${response.status}`);
    }

    return await response.json();
  },

  // Update appointment status
  updateAppointment: async (
    id: number,
    data: Partial<AppointmentFormData>
  ): Promise<Appointment> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(`${BASE_API_URL}/api/appointments/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update appointment: ${response.status}`);
    }

    return await response.json();
  },

  // Delete appointment
  deleteAppointment: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(`${BASE_API_URL}/api/appointments/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete appointment: ${response.status}`);
    }
  },

  // Get all appointment reasons
  getAppointmentReasons: async (): Promise<AppointmentReason[]> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(`${BASE_API_URL}/api/appointment-reasons/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch appointment reasons: ${response.status}`
      );
    }

    return await response.json();
  },
};
