export interface AppointmentReason {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  date: string | null;
  time: string | null;
  status: "pending" | "completed" | "cancelled";
  reason: AppointmentReason | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentFormData {
  full_name: string;
  email: string;
  phone: string;
  message?: string;
  date?: string;
  time?: string;
  reason_id?: number;
  status?: "pending" | "completed" | "cancelled";
}

export interface PaginatedAppointments {
  count: number;
  next: string | null;
  previous: string | null;
  results: Appointment[];
}

export interface AppointmentFilters {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  time?: string;
}
