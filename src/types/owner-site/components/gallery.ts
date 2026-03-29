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
      image: "https://images.pexels.com/photos/361755/pexels-photo-361755.jpeg",
      image_alt_description: "Gallery image 1",
      title: "Mountain View",
      description: "Beautiful mountain landscape",
      is_active: true,
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/4620843/pexels-photo-4620843.jpeg",
      image_alt_description: "Gallery image 2",
      title: "Forest Path",
      description: "Serene forest trail",
      is_active: true,
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/5241247/pexels-photo-5241247.jpeg",
      image_alt_description: "Gallery image 3",
      title: "Ocean Sunset",
      description: "Stunning ocean view",
      is_active: true,
    },
    {
      id: 4,
      image:
        "https://images.pexels.com/photos/17154777/pexels-photo-17154777.jpeg",
      image_alt_description: "Gallery image 4",
      title: "Mountain Peak",
      description: "Snow-capped mountains",
      is_active: true,
    },
    {
      id: 5,
      image:
        "https://images.pexels.com/photos/7290708/pexels-photo-7290708.jpeg",
      image_alt_description: "Gallery image 4",
      title: "Mountain Peak",
      description: "Snow-capped mountains",
      is_active: true,
    },
    {
      id: 6,
      image:
        "https://images.pexels.com/photos/10608368/pexels-photo-10608368.jpeg",
      image_alt_description: "Gallery image 4",
      title: "Mountain Peak",
      description: "Snow-capped mountains",
      is_active: true,
    },
  ],
  template: "gallery-1",
};

export const TEMPLATE6_DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: "gallery6-case-1",
    image: "https://picsum.photos/id/1033/400/600",
    image_alt_description: "Revive & Rise showcase",
    title: "Revive & Rise",
    description:
      "We step in to assess what’s holding you back, reshape your strategy, and breathe.",
    is_active: true,
  },
  {
    id: "gallery6-case-2",
    image: "https://picsum.photos/id/101/400/600",
    image_alt_description: "Scaling Made Simple showcase",
    title: "Scaling Made Simple",
    description:
      "We simplify the scaling process by identifying what’s working, removing what’s not, and building systems...",
    is_active: true,
  },
  {
    id: "gallery6-case-3",
    image: "https://picsum.photos/id/1031/400/600",
    image_alt_description: "Fast-Track Growth showcase",
    title: "Fast-Track Growth",
    description:
      "When time is critical and growth is essential, our focused strategies help you accelerate progress with...",
    is_active: true,
  },
  {
    id: "gallery6-case-4",
    image: "https://picsum.photos/id/1029/400/600",
    image_alt_description: "Future-Proofing showcase",
    title: "Future-Proofing",
    description:
      "We help organizations future-proof their operations with adaptable strategies, smart technologies.",
    is_active: true,
  },
];

export const DEFAULT_GALLERY_MAP: Record<GalleryData["template"], GalleryData> =
  {
    "gallery-1": { ...defaultGalleryData, template: "gallery-1" },
    "gallery-2": { ...defaultGalleryData, template: "gallery-2" },
    "gallery-3": { ...defaultGalleryData, template: "gallery-3" },
    "gallery-4": { ...defaultGalleryData, template: "gallery-4" },
    "gallery-5": { ...defaultGalleryData, template: "gallery-5" },
    "gallery-6": {
      ...defaultGalleryData,
      title: "How We Helped Clients Grow Smarter",
      subtitle:
        "Stories of transformation across industries, from revitalized brands to future-proof strategies.",
      images: TEMPLATE6_DEFAULT_IMAGES,
      template: "gallery-6",
    },
    "gallery-7": { ...defaultGalleryData, template: "gallery-7" },
  };
