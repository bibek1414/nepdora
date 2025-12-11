export interface BookingData {
  name: string;
  slug: string;
  email: string | null;
  price?: number;
  content: string;
  "ride date": string;
  "return date"?: string;
  "ride time": string;
  "vehicle name"?: string;
  "ride type"?: string;
  "phone number": string | number | null;
  "payment method": string;
  "payment status": string;
  status?: "pending" | "confirmed" | "cancelled";
  "whatsapp number"?: string | number | null;
  "license image"?: string;
  [key: string]: any; // Allow for other dynamic fields
}

export interface Booking {
  id: number;
  collection: number;
  data: BookingData;
  created_at: string;
  updated_at: string;
}

export interface PaginatedBookings {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

export interface BookingFilters {
  page?: number;
  page_size?: number;
  search?: string;
}
