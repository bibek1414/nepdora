import { apiFetch } from "@/lib/api-client";
import {
  Appointment,
  AppointmentFormData,
  PaginatedAppointments,
  AppointmentFilters,
  AppointmentReason,
} from "@/types/owner-site/admin/appointment";
import { getApiBaseUrl } from "@/config/site";
import { handleApiError } from "@/utils/api-error";
import { createHeaders } from "@/utils/headers";

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

    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  // Create a new appointment
  createAppointment: async (
    appointmentData: AppointmentFormData
  ): Promise<Appointment> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(`${BASE_API_URL}/api/appointments/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(appointmentData),
    });

    await handleApiError(response);
    return await response.json();
  },

  // Update appointment status
  updateAppointment: async (
    id: number,
    data: Partial<AppointmentFormData>
  ): Promise<Appointment> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(`${BASE_API_URL}/api/appointments/${id}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    return await response.json();
  },

  // Delete appointment
  deleteAppointment: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(`${BASE_API_URL}/api/appointments/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
  },

  // Get all appointment reasons
  getAppointmentReasons: async (): Promise<AppointmentReason[]> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(
      `${BASE_API_URL}/api/appointment-reasons/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    return await response.json();
  },
};
