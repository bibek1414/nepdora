export interface Owner {
  id: number;
  email: string;
  role: string;
  phone_number: string | null;
}

export interface Tenant {
  id: number;
  schema_name: string;
  name: string;
  created_on: string;
  owner: Owner;
}

export interface Domain {
  id: number;
  tenant: Tenant;
  domain: string;
  is_primary: boolean;
}

// Generic type for paginated responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
