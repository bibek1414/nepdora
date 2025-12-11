export type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "email"
  | "image";

export interface FieldDefinition {
  name: string;
  type: FieldType;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
  is_default?: boolean;
}

export interface DefaultField {
  type: FieldType;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  default_fields: Record<string, DefaultField>;
  fields: Omit<FieldDefinition, "is_default">[];
  all_fields: FieldDefinition[];
  send_email?: boolean;
  admin_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionInput {
  name: string;
  fields: Omit<FieldDefinition, "is_default">[];
  send_email?: boolean;
  admin_email?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  fields?: Omit<FieldDefinition, "is_default">[];
  send_email?: boolean;
  admin_email?: string;
}

export interface CollectionData {
  id: number;
  collection: number;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionDataInput {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface UpdateCollectionDataInput {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface CollectionDataListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CollectionData[];
}

export type Collections = Collection[];
export type CollectionDataList = CollectionData[];
