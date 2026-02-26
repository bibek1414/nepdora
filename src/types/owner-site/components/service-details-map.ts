import { ComponentTypeMap } from "./components";

export const DEFAULT_SERVICE_DETAILS_MAP: Record<
  string,
  ComponentTypeMap["service_details"]
> = {
  "service-details-style-1": {
    style: "style-1",
    showRelatedServices: true,
  },
  "service-details-style-2": {
    style: "style-2",
    showRelatedServices: true,
  },
  "service-details-style-3": {
    style: "style-3",
    showRelatedServices: true,
  },
};
