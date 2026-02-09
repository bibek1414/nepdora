export interface ServicesData {
  component_id?: string;
  component_type: "services";
  style:
    | "services-1"
    | "services-2"
    | "services-3"
    | "services-4"
    | "services-5"
    | "services-6";
  title: string;
  subtitle?: string;
  order?: number;
  // Additional fields for services-6
  tag?: string;
  italicWord?: string;
  buttonText?: string;
  buttonLink?: string;
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

export const DEFAULT_SERVICES_MAP: Record<ServicesData["style"], ServicesData> =
  {
    "services-1": { ...defaultServicesData, style: "services-1" },
    "services-2": { ...defaultServicesData, style: "services-2" },
    "services-3": { ...defaultServicesData, style: "services-3" },
    "services-4": { ...defaultServicesData, style: "services-4" },
    "services-5": { ...defaultServicesData, style: "services-5" },
    "services-6": { ...defaultServicesData, style: "services-6" },
  };
