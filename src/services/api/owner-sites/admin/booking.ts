import { apiFetch } from "@/lib/api-client";
import {
  Booking,
  PaginatedBookings,
  BookingFilters,
  BookingData,
} from "@/types/owner-site/admin/booking";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const bookingAPI = {
  getBookings: async (
    filters: BookingFilters = {}
  ): Promise<PaginatedBookings> => {
    const BASE_API_URL = getApiBaseUrl();

    const { page = 1, page_size = 10, search } = filters;

    const url = new URL(`${BASE_API_URL}/api/collections/booking/data/`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("page_size", page_size.toString());

    if (search && search.trim()) {
      url.searchParams.append("search", search.trim());
    }
    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.json();
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(
      `${BASE_API_URL}/api/collections/booking/data/${id}/`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    return await response.json();
  },

  updateBooking: async (
    id: number,
    data: Partial<BookingData>
  ): Promise<Booking> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await apiFetch(
      `${BASE_API_URL}/api/collections/booking/data/${id}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify({ data }),
      }
    );

    await handleApiError(response);
    return await response.json();
  },
};
