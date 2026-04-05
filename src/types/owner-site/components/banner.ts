import { BannerImage } from "../admin/banner";

export interface BaseBannerData {
  bannerType: "Slider" | "Sidebar" | "Banner";
}

export interface BannerTemplate1Data extends BaseBannerData {
  template: "banner-1";
  images: BannerImage[];
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface BannerTemplate2Data extends BaseBannerData {
  template: "banner-2";
  images: BannerImage[];
}

export interface BannerTemplate3Data extends BaseBannerData {
  template: "banner-3";
  images: BannerImage[];
}

export interface BannerTemplate4Data extends BaseBannerData {
  template: "banner-4";
  card1: {
    title: string;
    description: string;
    label: string;
    buttonText: string;
    link: string;
    image: string;
  };
  card2: {
    title: string;
    description: string;
    label: string;
    buttonText: string;
    link: string;
    image: string;
  };
}

export type BannerData =
  | BannerTemplate1Data
  | BannerTemplate2Data
  | BannerTemplate3Data
  | BannerTemplate4Data;

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

export const defaultBannerData: BannerTemplate1Data = {
  template: "banner-1",
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
};

export const DEFAULT_BANNER_MAP: Record<BannerData["template"], BannerData> = {
  "banner-1": defaultBannerData,
  "banner-2": {
    template: "banner-2",
    bannerType: "Banner",
    images: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2000&auto=format&fit=crop",
        image_alt_description: "Summit Sneakers",
        link: "#",
        badge: "Weekend Offer",
        title: "20% OFF!",
        subtitle: "Summit Sneakers! Hottest\nDeals Of The Month",
        is_active: true,
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=2000&auto=format&fit=crop",
        image_alt_description: "Colorful Classics",
        link: "#",
        badge: "Summer Offer",
        title: "30% OFF!",
        subtitle: "Colorful Classics!\nDirect From USA",
        is_active: true,
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2000&auto=format&fit=crop",
        image_alt_description: "Urban Runners",
        link: "#",
        badge: "Flash Sale",
        title: "15% OFF!",
        subtitle: "Urban Runners! Grab The\nBest Styles",
        is_active: true,
      },
    ],
  },
  "banner-3": {
    template: "banner-3",
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
  },
  "banner-4": {
    template: "banner-4",
    bannerType: "Banner",
    card1: {
      title: "Spring Collection Just Dropped",
      description:
        "Fresh formulas for your spring skincare refresh. Limited edition sets available.",
      label: "New Arrivals",
      buttonText: "Shop Collection",
      link: "/products",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=300&fit=crop",
    },
    card2: {
      title: "Earn Points, Get Free Products",
      description:
        "Join our loyalty program and earn 1 point for every $1 spent. Redeem for exclusive rewards.",
      label: "Glow Rewards",
      buttonText: "Join Now - It's Free",
      link: "/auth",
      image: "", // Card 2 uses stickers/emojis in the UI instead of a main image
    },
  },
};
