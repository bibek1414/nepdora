export interface AppointmentData {
  component_id?: string;
  component_type: "appointment";
  style: "appointment-1" | "appointment-2" | "appointment-3" | "appointment-4";
  title: string;
  subtitle?: string;
  description?: string;
  required_fields: {
    full_name: boolean;
    email: boolean;
    phone: boolean;
    message: boolean;
    date: boolean;
    time: boolean;
    reason: boolean;
  };
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  business_hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  order?: number;
}

export interface AppointmentComponentData {
  id: string | number;
  component_id: string;
  component_type: "appointment";
  data: AppointmentData;
  order?: number;
  page?: string;
}

export const defaultAppointmentData: AppointmentData = {
  component_type: "appointment",
  style: "appointment-1",
  title: "Book an Appointment",
  subtitle: "Schedule your visit with us",
  description: "Choose a convenient time and we'll be ready to assist you.",
  required_fields: {
    full_name: true,
    email: true,
    phone: true,
    message: false,
    date: true,
    time: true,
    reason: false,
  },
  contact_info: {
    email: "appointments@yourcompany.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
  },
  business_hours: {
    monday: "9:00 AM - 5:00 PM",
    tuesday: "9:00 AM - 5:00 PM",
    wednesday: "9:00 AM - 5:00 PM",
    thursday: "9:00 AM - 5:00 PM",
    friday: "9:00 AM - 5:00 PM",
    saturday: "10:00 AM - 2:00 PM",
    sunday: "Closed",
  },
};

export const DEFAULT_APPOINTMENT_MAP: Record<
  AppointmentData["style"],
  AppointmentData
> = {
  "appointment-1": { ...defaultAppointmentData, style: "appointment-1" },
  "appointment-2": { ...defaultAppointmentData, style: "appointment-2" },
  "appointment-3": { ...defaultAppointmentData, style: "appointment-3" },
  "appointment-4": { ...defaultAppointmentData, style: "appointment-4" },
};
// Type guards
export const isAppointmentTemplate1 = (data: AppointmentData): boolean =>
  data.style === "appointment-1";

export const isAppointmentTemplate2 = (data: AppointmentData): boolean =>
  data.style === "appointment-2";

export const isAppointmentTemplate3 = (data: AppointmentData): boolean =>
  data.style === "appointment-3";

export const isAppointmentTemplate4 = (data: AppointmentData): boolean =>
  data.style === "appointment-4";
