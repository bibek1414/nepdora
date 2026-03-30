export interface ToursTemplate1Data {
  template: "tours-1";
  title: string;
  buttonText: string;
  buttonLink: {
    url: string;
    target?: "_blank" | "_self";
  };
  collectionId?: number;
  collectionSlug?: string;
}

export interface ToursTemplate2Data {
  template: "tours-2";
  title: string;
  collectionId?: number;
  collectionSlug?: string;
}

export type ToursData = ToursTemplate1Data | ToursTemplate2Data;

export const DEFAULT_TOURS_MAP: Record<ToursData["template"], ToursData> = {
  "tours-1": {
    template: "tours-1",
    title: "Our Exclusive Tours",
    buttonText: "View All Tours",
    buttonLink: {
      url: "#",
      target: "_self",
    },
    collectionSlug: "tours",
  },
  "tours-2": {
    template: "tours-2",
    title: "Our Popular Tours",
    collectionSlug: "tours",
  },
};

export const isToursTemplate1 = (data: ToursData): data is ToursTemplate1Data =>
  data.template === "tours-1";

export const isToursTemplate2 = (data: ToursData): data is ToursTemplate2Data =>
  data.template === "tours-2";
