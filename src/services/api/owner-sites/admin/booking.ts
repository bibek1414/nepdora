import {
  Booking,
  PaginatedBookings,
  BookingFilters,
  BookingData,
} from "@/types/owner-site/admin/booking";
import { getApiBaseUrl } from "@/config/site";

export const bookingAPI = {
  getBookings: async (
    filters: BookingFilters = {}
  ): Promise<PaginatedBookings> => {
    const BASE_API_URL = getApiBaseUrl();

    const { page = 1, page_size = 10, search } = filters;

    // User provided URL: https://batoma.nepdora.baliyoventures.com/api/collections/booking/data/
    // Assuming BASE_API_URL handles the domain part or we should strictly use what's provided if it is tenant specific.
    // However, for generic implementation I should use BASE_API_URL.
    // I will append /api/collections/booking/data/
    const url = new URL(`${BASE_API_URL}/api/collections/booking/data/`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("page_size", page_size.toString());

    if (search && search.trim()) {
      url.searchParams.append("search", search.trim());
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.status}`);
    }

    return await response.json();
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(
      `${BASE_API_URL}/api/collections/booking/data/${id}/`,
      {
        // Assuming ID is part of path or query? Usually path.
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch booking: ${response.status}`);
    }
    return await response.json();
  },

  updateBooking: async (
    id: number,
    data: Partial<BookingData>
  ): Promise<Booking> => {
    const BASE_API_URL = getApiBaseUrl();
    const response = await fetch(
      `${BASE_API_URL}/api/collections/booking/data/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update booking: ${response.status}`);
    }

    return await response.json();
  },
};
