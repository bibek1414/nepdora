import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  ComponentTypeMap,
  ComponentResponse,
  CreateComponentRequest,
  UpdateComponentRequest,
  ApiResponse,
} from "@/types/owner-site/components/components";

export interface OrderUpdate {
  id: string | number; // Changed from componentId
  order: number;
}

export interface BulkOrderUpdateRequest {
  orderUpdates: OrderUpdate[];
}

const API_BASE_URL = getApiBaseUrl();

export const componentsApi = {
  // Get all components for a page
  getPageComponents: async <
    T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
  >(
    pageId: string | number
  ): Promise<ComponentResponse<T>[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageId}/components/?status=preview`,
        {
          method: "GET",
          headers: createHeaders(),
        }
      );

      await handleApiError(response);
      const data = await response.json();

      if (Array.isArray(data)) {
        return data;
      }

      return data.data || data.components || [];
    } catch (error) {
      throw new Error(
        `Failed to fetch components: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  getPageComponentsPublished: async <
    T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
  >(
    pageId: string | number
  ): Promise<ComponentResponse<T>[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageId}/components/`,
        {
          method: "GET",
          headers: createHeaders(),
        }
      );

      await handleApiError(response);
      const data = await response.json();

      if (Array.isArray(data)) {
        return data;
      }

      return data.data || data.components || [];
    } catch (error) {
      throw new Error(
        `Failed to fetch components: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Create a new component
  createComponent: async <T extends keyof ComponentTypeMap>(
    pageId: string | number,
    payload: CreateComponentRequest<T>,
    existingComponents?: ComponentResponse[]
  ): Promise<ComponentResponse<T>> => {
    try {
      let order = payload.order;
      if (order === undefined || order === 0) {
        if (existingComponents && existingComponents.length > 0) {
          const maxOrder = Math.max(
            ...existingComponents.map(c => c.order || 0)
          );
          order = maxOrder + 1;
        } else {
          order = 0;
        }
      }

      const componentPayload = {
        component_id:
          payload.component_id || `${payload.component_type}-${Date.now()}`,
        component_type: payload.component_type,
        data: payload.data,
        order,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageId}/components/`,
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(componentPayload),
        }
      );

      await handleApiError(response);
      const data = await response.json();

      return {
        id: data.id || data.data?.id,
        component_id: data.component_id || data.data?.component_id,
        component_type: data.component_type || data.data?.component_type,
        data: data.data?.data || data.data || data,
        order: data.order || data.data?.order || order,
        page: data.page || data.data?.page,
      };
    } catch (error) {
      throw new Error(
        `Failed to create ${payload.component_type} component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Update an existing component
  updateComponent: async <T extends keyof ComponentTypeMap>(
    pageId: string | number,
    id: string | number, // Changed from componentId
    payload: UpdateComponentRequest<T>,
    componentType: T
  ): Promise<ComponentResponse<T>> => {
    try {
      const updatePayload = {
        component_type: componentType,
        data: payload.data,
        ...(payload.order !== undefined && { order: payload.order }),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageId}/components/${id}/`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(updatePayload),
        }
      );

      await handleApiError(response);
      const data = await response.json();

      return {
        id: data.id || data.data?.id,
        component_id: data.component_id || data.data?.component_id,
        component_type: data.component_type || data.data?.component_type,
        data: data.data?.data || data.data || data,
        order: data.order || data.data?.order || 0,
        page: data.page || data.data?.page,
      };
    } catch (error) {
      throw new Error(
        `Failed to update ${componentType} component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Delete a component
  deleteComponent: async (
    pageId: string | number,
    id: string | number, // Changed from componentId
    componentType: keyof ComponentTypeMap
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageId}/components/${id}/`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      await handleApiError(response);
    } catch (error) {
      throw new Error(
        `Failed to delete ${componentType} component: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Get components by type
  getComponentsByType: async <T extends keyof ComponentTypeMap>(
    pageId: string | number,
    componentType: T
  ): Promise<ComponentResponse<T>[]> => {
    const allComponents = await componentsApi.getPageComponents(pageId);
    return allComponents.filter(
      (component): component is ComponentResponse<T> =>
        component.component_type === componentType
    );
  },

  // Get single component by id
  getComponent: async <T extends keyof ComponentTypeMap>(
    pageId: string | number,
    id: string | number // Changed from componentId
  ): Promise<ComponentResponse<T> | null> => {
    const allComponents = await componentsApi.getPageComponents(pageId);
    return (
      (allComponents.find(
        component => component.id === id
      ) as ComponentResponse<T>) || null
    );
  },
};

export const portfolioComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "portfolio"),
  create: (pageId: string | number, data: ComponentTypeMap["portfolio"]) =>
    componentsApi.createComponent(pageId, {
      component_type: "portfolio",
      data,
    }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["portfolio"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "portfolio"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "portfolio"),
};

export const heroComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "hero"),
  create: (pageId: string | number, data: ComponentTypeMap["hero"]) =>
    componentsApi.createComponent(pageId, { component_type: "hero", data }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["hero"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "hero"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "hero"),
};

export const bannerComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "banner"),
  create: (pageId: string | number, data: ComponentTypeMap["banner"]) =>
    componentsApi.createComponent(pageId, { component_type: "banner", data }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["banner"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "banner"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "banner"),
};

export const faqComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "faq"),
  create: (pageId: string | number, data: ComponentTypeMap["faq"]) =>
    componentsApi.createComponent(pageId, { component_type: "faq", data }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["faq"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "faq"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "faq"),
};

export const testimonialsComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "testimonials"),
  create: (pageId: string | number, data: ComponentTypeMap["testimonials"]) =>
    componentsApi.createComponent(pageId, {
      component_type: "testimonials",
      data,
    }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["testimonials"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "testimonials"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "testimonials"),
};

export const aboutComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "about"),
  create: (pageId: string | number, data: ComponentTypeMap["about"]) =>
    componentsApi.createComponent(pageId, { component_type: "about", data }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["about"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "about"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "about"),
};

export const blogComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "blog"),
  create: (pageId: string | number, data: ComponentTypeMap["blog"]) =>
    componentsApi.createComponent(pageId, { component_type: "blog", data }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["blog"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "blog"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "blog"),
};

export const productComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "products"),
  create: (pageId: string | number, data: ComponentTypeMap["products"]) =>
    componentsApi.createComponent(pageId, {
      component_type: "products",
      data,
    }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["products"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "products"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "products"),
};

export const categoryComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "category"),
  create: (pageId: string | number, data: ComponentTypeMap["category"]) =>
    componentsApi.createComponent(pageId, {
      component_type: "category",
      data,
    }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["category"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "category"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "category"),
};

export const subCategoryComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "subcategory"),
  create: (pageId: string | number, data: ComponentTypeMap["subcategory"]) =>
    componentsApi.createComponent(pageId, {
      component_type: "subcategory",
      data,
    }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["subcategory"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "subcategory"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "subcategory"),
};

export const teamComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "team"),
  create: (pageId: string | number, data: ComponentTypeMap["team"]) =>
    componentsApi.createComponent(pageId, { component_type: "team", data }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["team"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "team"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "team"),
};

export const componentOrdersApi = {
  updateComponentOrders: async (
    pageId: string | number,
    orderUpdates: OrderUpdate[]
  ): Promise<void> => {
    try {
      for (const { id, order } of orderUpdates) {
        const response = await fetch(
          `${API_BASE_URL}/api/pages/${pageId}/components/${id}/`,
          {
            method: "PATCH",
            headers: createHeaders(),
            body: JSON.stringify({ order }),
          }
        );
        await handleApiError(response);
      }
    } catch (error) {
      throw new Error(
        `Failed to update component orders: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};

export const newsletterComponentsApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "newsletter"),
  create: (pageId: string | number, data: ComponentTypeMap["newsletter"]) =>
    componentsApi.createComponent(pageId, {
      component_type: "newsletter",
      data,
    }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["newsletter"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "newsletter"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "newsletter"),
};

export const youtubeComponentApi = {
  getAll: (pageId: string | number) =>
    componentsApi.getComponentsByType(pageId, "youtube"),
  create: (pageId: string | number, data: ComponentTypeMap["youtube"]) =>
    componentsApi.createComponent(pageId, {
      component_type: "youtube",
      data,
    }),
  update: (
    pageId: string | number,
    id: string | number,
    data: Partial<ComponentTypeMap["youtube"]>
  ) => componentsApi.updateComponent(pageId, id, { data }, "youtube"),
  delete: (pageId: string | number, id: string | number) =>
    componentsApi.deleteComponent(pageId, id, "youtube"),
};
