export interface ServicesData {
  component_id?: string;
  component_type: "services";
  style:
    | "services-1"
    | "services-2"
    | "services-3"
    | "services-4"
    | "services-5";
  title: string;
  subtitle?: string;
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
  style: "services-1",
  title: "Latest Services Posts",
  subtitle: "Stay updated with our newest articles and insights.",
};
