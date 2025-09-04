export interface BannerImage {
  id?: number;
  image: string | File;
  image_alt_description: string;
  link: string;
  is_active: boolean;
}

export interface Banner {
  id: number;
  banner_type: "Slider" | "Sidebar" | "Banner";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: BannerImage[];
}

export interface CreateBannerWithImagesRequest {
  banner_type: "Slider" | "Sidebar" | "Banner";
  is_active: boolean;
  images: BannerImage[];
}

export type UpdateBannerWithImagesRequest =
  Partial<CreateBannerWithImagesRequest>;
