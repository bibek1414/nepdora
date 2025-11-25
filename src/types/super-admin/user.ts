export interface Store {
  id: number;
  store_name: string;
  store_address: string | null;
  store_number: string | null;
  role: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  stores: Store[];
  schema_name: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
