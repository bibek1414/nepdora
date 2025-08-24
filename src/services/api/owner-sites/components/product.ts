import {
  ProductsComponentData,
  ProductsData,
} from "@/types/owner-site/components/products";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export interface CreateProductsComponentRequest {
  component_id: string;
  component_type: "products";
  data: ProductsData;
  order?: number;
}

export interface UpdateProductsComponentRequest {
  data: ProductsData;
  order?: number;
}

export const productComponentsApi = {
  // Create products component
  createProductsComponent: async (
    pageSlug: string,
    payload: CreateProductsComponentRequest
  ): Promise<ProductsComponentData> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/page/${pageSlug}/products/`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(payload),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Update products component
  updateProductsComponent: async (
    componentId: string,
    payload: UpdateProductsComponentRequest
  ): Promise<ProductsComponentData> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/products-component/${componentId}/`,
      {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(payload),
      }
    );
    await handleApiError(response);
    return response.json();
  },

  // Delete products component
  deleteProductsComponent: async (componentId: string): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/products-component/${componentId}/`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );
    await handleApiError(response);
  },
};
