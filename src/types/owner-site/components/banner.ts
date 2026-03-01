import { BannerImage } from "../admin/banner";
export interface BannerData {
  title: string;
  subtitle?: string;
  bannerType: "Slider" | "Sidebar" | "Banner";
  images: BannerImage[];
  template: "banner-1" | "banner-2" | "banner-3" | "banner-4" | "banner-5";
}

export interface BannerComponentData {
  id: string | number;
  component_id?: string;
  component_type: "banner";
  data: BannerData;
  order: number;
  page?: number;
}

export interface CreateBannerComponentRequest {
  component_id?: string;
  component_type: "banner";
  data: BannerData;
  order?: number;
}

export interface UpdateBannerComponentRequest {
  data: Partial<BannerData>;
  order?: number;
}

export const defaultBannerData: BannerData = {
  title: "Featured Content",
  subtitle: "Discover our latest offerings",
  bannerType: "Banner",
  images: [
    {
      id: 1,
      image: "/fallback/image-not-found.png",
      image_alt_description: "Featured banner image",
      link: "#",
      is_active: true,
    },
  ],
  template: "banner-1",
};

export const DEFAULT_BANNER_MAP: Record<BannerData["template"], BannerData> = {
  "banner-1": { ...defaultBannerData, template: "banner-1" },
  "banner-2": { ...defaultBannerData, template: "banner-2" },
  "banner-3": { ...defaultBannerData, template: "banner-3" },
  "banner-4": { ...defaultBannerData, template: "banner-4" },
  "banner-5": { ...defaultBannerData, template: "banner-5" },
};
