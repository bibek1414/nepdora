export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface PaginatedCustomers {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}

export interface CustomerFilters {
  page?: number;
  page_size?: number;
  search?: string;
}
