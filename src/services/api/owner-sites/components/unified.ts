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
        `${API_BASE_URL}/api/pages/${pageSlug}/components/`,
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

  // Create a new component
  createComponent: async <T extends keyof ComponentTypeMap>(
    pageSlug: string,
    payload: CreateComponentRequest<T>
  ): Promise<ComponentResponse<T>> => {
    try {
      const componentPayload = {
        component_id:
          payload.component_id || `${payload.component_type}-${Date.now()}`,
        component_type: payload.component_type,
        data: payload.data,
        order: payload.order || 0,
      };

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
        order: data.order || data.data?.order || 0,
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

// Specific component type APIs that use the generic service
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
