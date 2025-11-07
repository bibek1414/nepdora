export interface GalleryImage {
  id: number | string;
  image: string | File;
  image_alt_description: string;
  title?: string;
  description?: string;
  category?: string;
  is_active: boolean;
}

export interface GalleryData {
  title: string;
  subtitle?: string;
  images: GalleryImage[];
  template: "gallery-1" | "gallery-2" | "gallery-3" | "gallery-4" | "gallery-5";
  layout: "grid" | "masonry" | "carousel";
  columns: 2 | 3 | 4 | 5;
  showTitles: boolean;
  showDescriptions: boolean;
  enableLightbox: boolean;
  enableFiltering: boolean;
  categories: string[];
  spacing: "tight" | "normal" | "wide";
  borderRadius: "none" | "small" | "medium" | "large";
  hoverEffect: "none" | "zoom" | "overlay" | "lift";
}

export interface GalleryComponentData {
  id: string | number;
  component_id: string;
  component_type: "gallery";
  data: GalleryData;
  order: number;
  page?: number;
}

export interface CreateGalleryComponentRequest {
  component_id: string;
  component_type: "gallery";
  data: GalleryData;
  order?: number;
}

export interface UpdateGalleryComponentRequest {
  data: Partial<GalleryData>;
  order?: number;
}

export const defaultGalleryData: GalleryData = {
  title: "Our Gallery",
  subtitle: "Explore our collection of images",
  images: [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      image_alt_description: "Gallery image 1",
      title: "Mountain View",
      description: "Beautiful mountain landscape",
      category: "Nature",
      is_active: true,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
      image_alt_description: "Gallery image 2",
      title: "Forest Path",
      description: "Serene forest trail",
      category: "Nature",
      is_active: true,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80",
      image_alt_description: "Gallery image 3",
      title: "Ocean Sunset",
      description: "Stunning ocean view",
      category: "Nature",
      is_active: true,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
      image_alt_description: "Gallery image 4",
      title: "Mountain Peak",
      description: "Snow-capped mountains",
      category: "Nature",
      is_active: true,
    },
  ],
  template: "gallery-1",
  layout: "grid",
  columns: 4,
  showTitles: true,
  showDescriptions: false,
  enableLightbox: true,
  enableFiltering: true,
  categories: ["Nature", "Architecture", "People", "Abstract"],
  spacing: "normal",
  borderRadius: "medium",
  hoverEffect: "zoom",
};
