import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import {
  CreateBannerWithImagesRequest,
  Banner,
  UpdateBannerWithImagesRequest,
} from "@/types/owner-site/admin/banner";
import { createHeaders, createHeadersTokenOnly } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

const prepareFormData = (
  data: CreateBannerWithImagesRequest | UpdateBannerWithImagesRequest,
  isUpdate: boolean = false
) => {
  const formData = new FormData();

  // Add banner fields
  if (data.banner_type) {
    formData.append("banner_type", data.banner_type);
  }
  if (data.is_active !== undefined) {
    formData.append("is_active", data.is_active.toString());
  }

  // Add images with the correct flat structure that Django expects
  if (data.images && data.images.length > 0) {
    for (let index = 0; index < data.images.length; index++) {
      const image = data.images[index];

      // Only append image field if it's a new file upload
      if (image.image instanceof File) {
        formData.append(`images[${index}]image`, image.image);
      }

      formData.append(
        `images[${index}]image_alt_description`,
        image.image_alt_description || ""
      );
      formData.append(`images[${index}]link`, image.link || "");
      formData.append(`images[${index}]is_active`, image.is_active.toString());

      // Add image ID if it exists (for updates)
      if (image.id) {
        formData.append(`images[${index}]id`, image.id.toString());
      }
    }
  }

  return formData;
};

// Banner API functions
export const bannerApi = {
  // Get all banners with images
  getBanners: async (): Promise<Banner[]> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await apiFetch(`${API_BASE_URL}/api/banners/`, {
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Get single banner with images
  getBanner: async (id: number): Promise<Banner> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await apiFetch(`${API_BASE_URL}/api/banners/${id}/`, {
      headers: createHeaders(),
    });
    await handleApiError(response);
    return response.json();
  },

  // Create banner with images
  createBannerWithImages: async (
    data: CreateBannerWithImagesRequest
  ): Promise<Banner> => {
    const API_BASE_URL = getApiBaseUrl();

    const formData = prepareFormData(data, false);

    const response = await apiFetch(`${API_BASE_URL}/api/banners/`, {
      method: "POST",
      body: formData,
      headers: createHeadersTokenOnly(),
    });

    await handleApiError(response);
    return response.json();
  },

  // Update banner with images
  updateBannerWithImages: async (
    id: number,
    data: UpdateBannerWithImagesRequest
  ): Promise<Banner> => {
    const API_BASE_URL = getApiBaseUrl();

    const formData = prepareFormData(data, true);

    const response = await apiFetch(`${API_BASE_URL}/api/banners/${id}/`, {
      method: "PATCH",
      body: formData,
      headers: createHeadersTokenOnly(),
    });

    await handleApiError(response);
    return response.json();
  },

  // Delete banner
  deleteBanner: async (id: number): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await apiFetch(`${API_BASE_URL}/api/banners/${id}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
  },
};
