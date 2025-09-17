export interface PopUp {
  id?: number;
  title: string;
  image?: File | string | null;
  disclaimer: string;
  enabled_fields: string[];
  is_active: boolean;
}

export interface PopUpForm {
  id?: number;
  popup: number;
  name?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  created_at: string;
}

export interface PopupFormData {
  [key: string]: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "tel";
  required: boolean;
  placeholder?: string;
}

export interface PaginatedPopupFormResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PopUpForm[];
}

export interface PopupFormFilters {
  page?: number;
  page_size?: number;
  search?: string;
  popup?: number;
}
