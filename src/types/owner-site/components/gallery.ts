export interface GalleryImage {
  id: number | string;
  image: string | File;
  image_alt_description: string;
  title?: string;
  description?: string;
  is_active: boolean;
}

export interface GalleryData {
  title: string;
  subtitle?: string;
  images: GalleryImage[];
  template:
    | "gallery-1"
    | "gallery-2"
    | "gallery-3"
    | "gallery-4"
    | "gallery-5"
    | "gallery-6"
    | "gallery-7";
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
        "/fallback/image-not-found.png",
      image_alt_description: "Gallery image 1",
      title: "Mountain View",
      description: "Beautiful mountain landscape",
      is_active: true,
    },
    {
      id: 2,
      image:
        "/fallback/image-not-found.png",
      image_alt_description: "Gallery image 2",
      title: "Forest Path",
      description: "Serene forest trail",
      is_active: true,
    },
    {
      id: 3,
      image:
        "/fallback/image-not-found.png",
      image_alt_description: "Gallery image 3",
      title: "Ocean Sunset",
      description: "Stunning ocean view",
      is_active: true,
    },
    {
      id: 4,
      image:
        "/fallback/image-not-found.png",
      image_alt_description: "Gallery image 4",
      title: "Mountain Peak",
      description: "Snow-capped mountains",
      is_active: true,
    },
  ],
  template: "gallery-1",
};

export const DEFAULT_GALLERY_MAP: Record<GalleryData["template"], GalleryData> =
  {
    "gallery-1": { ...defaultGalleryData, template: "gallery-1" },
    "gallery-2": { ...defaultGalleryData, template: "gallery-2" },
    "gallery-3": { ...defaultGalleryData, template: "gallery-3" },
    "gallery-4": { ...defaultGalleryData, template: "gallery-4" },
    "gallery-5": { ...defaultGalleryData, template: "gallery-5" },
    "gallery-6": { ...defaultGalleryData, template: "gallery-6" },
    "gallery-7": { ...defaultGalleryData, template: "gallery-7" },
  };
