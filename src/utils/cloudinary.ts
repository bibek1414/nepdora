export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
}

// Get Cloudinary configuration from environment variables
const getCloudinaryConfig = (): CloudinaryConfig => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables."
    );
  }

  return {
    cloudName,
    uploadPreset,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  };
};

export const DEFAULT_MAX_IMAGE_SIZE = 500 * 1024; // 500KB

export const uploadToCloudinary = async (
  file: File,
  options?: {
    folder?: string;
    transformation?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
    maxSize?: number; // in bytes
  }
): Promise<string> => {
  try {
    const effectiveMaxSize = options?.maxSize ?? DEFAULT_MAX_IMAGE_SIZE;

    if (file.size > effectiveMaxSize) {
      const maxSizeFormatted =
        effectiveMaxSize >= 1024 * 1024
          ? `${(effectiveMaxSize / (1024 * 1024)).toFixed(1)}MB`
          : `${Math.round(effectiveMaxSize / 1024)}KB`;
      throw new Error(`File size exceeds the limit of ${maxSizeFormatted}`);
    }

    const config = getCloudinaryConfig();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", config.uploadPreset);

    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    if (options?.resourceType) {
      formData.append("resource_type", options.resourceType);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/${options?.resourceType || "image"}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Cloudinary upload failed: ${errorData.error?.message || response.statusText}`
      );
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to upload image to Cloudinary"
    );
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const config = getCloudinaryConfig();

    if (!config.apiKey) {
      console.warn("Cloudinary API key not provided, skipping deletion");
      return;
    }

    console.warn(
      "Cloudinary deletion should be implemented server-side for security"
    );
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

// Utility to optimize Cloudinary URLs
export const optimizeCloudinaryUrl = (
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "webp" | "jpg" | "png";
    crop?: "fill" | "fit" | "scale" | "crop";
  }
): string => {
  if (!url.includes("cloudinary.com")) {
    return url; // Not a Cloudinary URL
  }

  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);

  if (transformations.length === 0) {
    return url;
  }

  const transformationString = transformations.join(",");

  // Insert transformations into Cloudinary URL
  return url.replace(/\/upload\//, `/upload/${transformationString}/`);
};

// Convert Unsplash URLs to Cloudinary-optimized URLs
export const convertUnsplashUrl = (
  url: string,
  width: number = 800,
  quality: number = 80
): string => {
  if (!url) return "";

  // Check if it's already a Cloudinary URL
  if (url.includes("cloudinary.com")) {
    return optimizeCloudinaryUrl(url, { width, quality: quality as number });
  }

  // Handle Unsplash URLs
  const unsplashPhotoMatch = url.match(
    /unsplash\.com\/photos\/.*?-([a-zA-Z0-9_-]{11})/
  );

  if (unsplashPhotoMatch) {
    const photoId = unsplashPhotoMatch[1];
    return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=${quality}`;
  }

  return url;
};
