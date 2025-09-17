import { BannerImage } from "../admin/banner";
export interface BannerData {
  title: string;
  subtitle?: string;
  bannerType: "Slider" | "Sidebar" | "Banner";
  images: BannerImage[];
  autoplay: boolean;
  autoplayDelay: number;
  showArrows: boolean;
  showDots: boolean;
  template: "banner-1" | "banner-2" | "banner-3" | "banner-4";
  backgroundColor: string;
  textColor: string;
  overlayOpacity: number;
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
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      image_alt_description: "Featured banner image",
      link: "/featured",
      is_active: true,
    },
  ],
  autoplay: true,
  autoplayDelay: 5000,
  showArrows: true,
  showDots: true,
  template: "banner-1",
  backgroundColor: "#000000",
  textColor: "#FFFFFF",
  overlayOpacity: 0.4,
};
