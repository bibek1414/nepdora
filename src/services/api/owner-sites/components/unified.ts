import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  ComponentTypeMap,
  ComponentResponse,
  CreateComponentRequest,
  UpdateComponentRequest,
} from "@/types/owner-site/components/components";

export interface OrderUpdate {
  componentId: string;
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
    pageSlug: string
  ): Promise<ComponentResponse<T>[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageSlug}/components/?status=preview`,
        {
          method: "GET",
          headers: createHeaders(),
        }
      );

      await handleApiError(response);
      const data = await response.json();

      // Handle both array response and object with data/components property
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
    pageSlug: string
  ): Promise<ComponentResponse<T>[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageSlug}/components/`,
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

  // OPTIMIZED: Create component with better order management
  createComponent: async <T extends keyof ComponentTypeMap>(
    pageSlug: string,
    payload: CreateComponentRequest<T>,
    existingComponents?: ComponentResponse[],
    insertIndex?: number
  ): Promise<ComponentResponse<T>> => {
    try {
      let order = payload.order;

      // Calculate order based on insertIndex
      if (order === undefined) {
        if (insertIndex !== undefined) {
          order = insertIndex;
        } else if (existingComponents && existingComponents.length > 0) {
          const maxOrder = Math.max(
            ...existingComponents.map(c => c.order || 0)
          );
          order = maxOrder + 1;
        } else {
          order = 0;
        }
      }

      // FIXED: If inserting at a specific index, update existing components FIRST
      if (
        insertIndex !== undefined &&
        existingComponents &&
        existingComponents.length > 0
      ) {
        const componentsToUpdate = existingComponents.filter(
          comp => (comp.order ?? 0) >= insertIndex
        );

        if (componentsToUpdate.length > 0) {
          // Update orders in parallel
          await Promise.all(
            componentsToUpdate.map(comp =>
              fetch(
                `${API_BASE_URL}/api/pages/${pageSlug}/components/${comp.component_id}/`,
                {
                  method: "PATCH",
                  headers: createHeaders(),
                  body: JSON.stringify({ order: (comp.order ?? 0) + 1 }),
                }
              ).then(handleApiError)
            )
          );
        }
      }

      const componentPayload = {
        component_id:
          payload.component_id || `${payload.component_type}-${Date.now()}`,
        component_type: payload.component_type,
        data: payload.data,
        order,
      };

      // Now create the new component at the correct position
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageSlug}/components/`,
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
    pageSlug: string,
    componentId: string,
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
        `${API_BASE_URL}/api/pages/${pageSlug}/components/${componentId}/`,
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
    pageSlug: string,
    componentId: string,
    componentType: keyof ComponentTypeMap
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageSlug}/components/${componentId}/`,
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
    pageSlug: string,
    componentType: T
  ): Promise<ComponentResponse<T>[]> => {
    const allComponents = await componentsApi.getPageComponents(pageSlug);
    return allComponents.filter(
      (component): component is ComponentResponse<T> =>
        component.component_type === componentType
    );
  },

  // Get single component by id
  getComponent: async <T extends keyof ComponentTypeMap>(
    pageSlug: string,
    componentId: string
  ): Promise<ComponentResponse<T> | null> => {
    const allComponents = await componentsApi.getPageComponents(pageSlug);
    return (
      (allComponents.find(
        component => component.component_id === componentId
      ) as ComponentResponse<T>) || null
    );
  },
};

// OPTIMIZED: Batch update component orders
export const componentOrdersApi = {
  updateComponentOrders: async (
    pageSlug: string,
    orderUpdates: OrderUpdate[]
  ): Promise<void> => {
    try {
      // Process all updates in parallel instead of sequentially
      await Promise.all(
        orderUpdates.map(({ componentId, order }) =>
          fetch(
            `${API_BASE_URL}/api/pages/${pageSlug}/components/${componentId}/`,
            {
              method: "PATCH",
              headers: createHeaders(),
              body: JSON.stringify({ order }),
            }
          ).then(handleApiError)
        )
      );
    } catch (error) {
      throw new Error(
        `Failed to update component orders: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};

// All other component-specific APIs remain the same...
export const portfolioComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "portfolio"),
  create: (pageSlug: string, data: ComponentTypeMap["portfolio"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "portfolio",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["portfolio"]>
  ) =>
    componentsApi.updateComponent(pageSlug, componentId, { data }, "portfolio"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "portfolio"),
};

export const heroComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "hero"),
  create: (pageSlug: string, data: ComponentTypeMap["hero"]) =>
    componentsApi.createComponent(pageSlug, { component_type: "hero", data }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["hero"]>
  ) => componentsApi.updateComponent(pageSlug, componentId, { data }, "hero"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "hero"),
};

export const bannerComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "banner"),
  create: (pageSlug: string, data: ComponentTypeMap["banner"]) =>
    componentsApi.createComponent(pageSlug, { component_type: "banner", data }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["banner"]>
  ) => componentsApi.updateComponent(pageSlug, componentId, { data }, "banner"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "banner"),
};

export const faqComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "faq"),
  create: (pageSlug: string, data: ComponentTypeMap["faq"]) =>
    componentsApi.createComponent(pageSlug, { component_type: "faq", data }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["faq"]>
  ) => componentsApi.updateComponent(pageSlug, componentId, { data }, "faq"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "faq"),
};

export const testimonialsComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "testimonials"),
  create: (pageSlug: string, data: ComponentTypeMap["testimonials"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "testimonials",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["testimonials"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      { data },
      "testimonials"
    ),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "testimonials"),
};

export const aboutComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "about"),
  create: (pageSlug: string, data: ComponentTypeMap["about"]) =>
    componentsApi.createComponent(pageSlug, { component_type: "about", data }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["about"]>
  ) => componentsApi.updateComponent(pageSlug, componentId, { data }, "about"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "about"),
};

export const blogComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "blog"),
  create: (pageSlug: string, data: ComponentTypeMap["blog"]) =>
    componentsApi.createComponent(pageSlug, { component_type: "blog", data }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["blog"]>
  ) => componentsApi.updateComponent(pageSlug, componentId, { data }, "blog"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "blog"),
};

export const productComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "products"),
  create: (pageSlug: string, data: ComponentTypeMap["products"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "products",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["products"]>
  ) =>
    componentsApi.updateComponent(pageSlug, componentId, { data }, "products"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "products"),
};

export const categoryComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "category"),
  create: (pageSlug: string, data: ComponentTypeMap["category"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "category",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["category"]>
  ) =>
    componentsApi.updateComponent(pageSlug, componentId, { data }, "category"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "category"),
};

export const subCategoryComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "subcategory"),
  create: (pageSlug: string, data: ComponentTypeMap["subcategory"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "subcategory",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["subcategory"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      { data },
      "subcategory"
    ),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "subcategory"),
};

export const teamComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "team"),
  create: (pageSlug: string, data: ComponentTypeMap["team"]) =>
    componentsApi.createComponent(pageSlug, { component_type: "team", data }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["team"]>
  ) => componentsApi.updateComponent(pageSlug, componentId, { data }, "team"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "team"),
};

export const newsletterComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "newsletter"),
  create: (pageSlug: string, data: ComponentTypeMap["newsletter"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "newsletter",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["newsletter"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      { data },
      "newsletter"
    ),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "newsletter"),
};

export const galleryComponentsApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "gallery"),
  create: (pageSlug: string, data: ComponentTypeMap["gallery"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "gallery",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["gallery"]>
  ) =>
    componentsApi.updateComponent(pageSlug, componentId, { data }, "gallery"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "gallery"),
};

export const youtubeComponentApi = {
  getAll: (pageSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "youtube"),
  create: (pageSlug: string, data: ComponentTypeMap["youtube"]) =>
    componentsApi.createComponent(pageSlug, {
      component_type: "youtube",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    data: Partial<ComponentTypeMap["youtube"]>
  ) =>
    componentsApi.updateComponent(pageSlug, componentId, { data }, "youtube"),
  delete: (pageSlug: string, componentId: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, "youtube"),
};
