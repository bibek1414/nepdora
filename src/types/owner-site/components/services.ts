export interface ServicesData {
  component_id?: string;
  component_type: "services";
  style: "grid-1" | "grid-2" | "list-1" | "grid-3";
  title: string;
  subtitle?: string;
  page_size: number;
  showPagination?: boolean;
  itemsPerRow?: number;
  showDate?: boolean;
  order?: number;
}

export interface ServicesComponentData {
  id: string | number;
  component_id: string;
  component_type: "services";
  data: ServicesData;
  order?: number;
  page?: string;
}

export const defaultServicesData: ServicesData = {
  component_type: "services",
  style: "grid-1",
  title: "Latest Services Posts",
  subtitle: "Stay updated with our newest articles and insights.",
  page_size: 6,
  showPagination: false,
  itemsPerRow: 3,
  showDate: true,
};
