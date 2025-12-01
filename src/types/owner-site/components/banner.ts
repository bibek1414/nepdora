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
      image:
        "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      image_alt_description: "Featured banner image",
      link: "#",
      is_active: true,
    },
  ],
  template: "banner-1",
};
