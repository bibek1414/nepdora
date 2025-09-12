import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import {
  GetProductsResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
  Product,
  PaginationParams,
} from "@/types/owner-site/product";

// Extended interface for filtering parameters
interface ProductFilterParams extends Omit<PaginationParams, "category"> {
  category?: string;
  sub_category?: string;
  category_id?: number;
  sub_category_id?: number;
  is_featured?: boolean;
  is_popular?: boolean;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}

const buildProductFormData = (
  data: CreateProductRequest | UpdateProductRequest
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // Skip null or undefined values
    }

    if (key === "image_files" && Array.isArray(value)) {
      let imageCount = 0;
      value.forEach(imageFile => {
        if (imageFile instanceof File) {
          formData.append("image_files", imageFile);
          imageCount++;
        }
      });
      console.log(`Appended ${imageCount} new image files to FormData`);
    } else if (key === "thumbnail_image" && value instanceof File) {
      formData.append("thumbnail_image", value);
    } else if (key === "image_files") {
      return;
    } else if (typeof value === "boolean") {
      formData.append(key, value.toString());
    } else if (typeof value === "number") {
      formData.append(key, value.toString());
    } else if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  // Debug: Log FormData contents
  console.log("FormData contents:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(
        `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
      );
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  return formData;
};

// Helper function to validate file sizes before sending
const validateFiles = (
  data: CreateProductRequest | UpdateProductRequest
): string[] => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Check thumbnail image
  if (data.thumbnail_image instanceof File) {
    if (data.thumbnail_image.size > maxSize) {
      errors.push(
        `Thumbnail image "${data.thumbnail_image.name}" is too large (${(data.thumbnail_image.size / 1024 / 1024).toFixed(2)}MB). Max size: 5MB`
      );
    }
  }

  // Check additional images
  if (Array.isArray(data.image_files)) {
    data.image_files.forEach((file, index) => {
      if (file instanceof File && file.size > maxSize) {
        errors.push(
          `Image ${index + 1} "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max size: 5MB`
        );
      }
    });
  }

  return errors;
};

export const productApi = {
  getProducts: async (
    params: ProductFilterParams = {}
  ): Promise<GetProductsResponse> => {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy,
      sortOrder = "asc",
      category,
      sub_category,
      category_id,
      sub_category_id,
      is_featured,
      is_popular,
      min_price,
      max_price,
      in_stock,
    } = params;

    const API_BASE_URL = getApiBaseUrl();
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add existing parameters
    if (search) queryParams.append("search", search);
    if (sortBy) {
      queryParams.append("sort_by", sortBy);
      queryParams.append("sort_order", sortOrder);
    }

    // Add filtering parameters
    if (category) queryParams.append("category", category);
    if (sub_category) queryParams.append("sub_category", sub_category);
    if (category_id) queryParams.append("category_id", category_id.toString());
    if (sub_category_id)
      queryParams.append("sub_category_id", sub_category_id.toString());
    if (is_featured !== undefined)
      queryParams.append("is_featured", is_featured.toString());
    if (is_popular !== undefined)
      queryParams.append("is_popular", is_popular.toString());
    if (min_price !== undefined)
      queryParams.append("min_price", min_price.toString());
    if (max_price !== undefined)
      queryParams.append("max_price", max_price.toString());
    if (in_stock !== undefined)
      queryParams.append("in_stock", in_stock.toString());

    console.log(`Fetching products with params: ${queryParams.toString()}`);

    const response = await fetch(
      `${API_BASE_URL}/api/product/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    await handleApiError(response);
    const data = await response.json();
    const results = data.results || [];
    const count = data.count || 0;
    const totalPages = Math.ceil(count / limit);

    return {
      results,
      count,
      next: data.next || null,
      previous: data.previous || null,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  },

  getProduct: async (slug: string): Promise<Product> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${slug}/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return response.json();
  },

  createProduct: async (
    data: CreateProductRequest
  ): Promise<CreateProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    // Validate file sizes before sending
    const validationErrors = validateFiles(data);
    if (validationErrors.length > 0) {
      throw new Error(`File validation failed: ${validationErrors.join(", ")}`);
    }

    const formData = buildProductFormData(data);

    const response = await fetch(`${API_BASE_URL}/api/product/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // Don't set Content-Type header - let the browser set it with boundary
      },
      body: formData,
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product created successfully",
    };
  },

  updateProduct: async (
    slug: string,
    data: UpdateProductRequest
  ): Promise<UpdateProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    // Validate file sizes before sending
    const validationErrors = validateFiles(data);
    if (validationErrors.length > 0) {
      throw new Error(`File validation failed: ${validationErrors.join(", ")}`);
    }

    const formData = buildProductFormData(data);

    const response = await fetch(`${API_BASE_URL}/api/product/${slug}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // Don't set Content-Type header - let the browser set it with boundary
      },
      body: formData,
    });

    await handleApiError(response);
    const responseData = await response.json();
    return {
      data: responseData,
      message: "Product updated successfully",
    };
  },

  deleteProduct: async (slug: string): Promise<DeleteProductResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/product/${slug}/`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
    return {
      message: "Product deleted successfully",
    };
  },
};

// Export the extended interface for use in hooks
export type { ProductFilterParams };
