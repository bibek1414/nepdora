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

  createComponent: async <T extends keyof ComponentTypeMap>(
    pageSlug: string,
    payload: CreateComponentRequest<T>,
    existingComponents?: ComponentResponse[],
    insertIndex?: number
  ): Promise<ComponentResponse<T>> => {
    try {
      let order = payload.order;

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

      // OPTIMIZED: Batch order updates in a single request
      if (
        insertIndex !== undefined &&
        existingComponents &&
        existingComponents.length > 0
      ) {
        const componentsToUpdate = existingComponents.filter(
          comp => (comp.order ?? 0) >= insertIndex
        );

        if (componentsToUpdate.length > 0) {
          // Use your existing bulk update endpoint
          const orderUpdates = componentsToUpdate.map(comp => ({
            componentId: comp.component_id,
            order: (comp.order ?? 0) + 1,
          }));

          await componentOrdersApi.updateComponentOrders(
            pageSlug,
            orderUpdates
          );
        }
      }

      // Create the new component
      const componentPayload = {
        component_id:
          payload.component_id || `${payload.component_type}-${Date.now()}`,
        component_type: payload.component_type,
        data: payload.data,
        order,
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

  // Replace a component
  replaceComponent: async <T extends keyof ComponentTypeMap>(
    pageSlug: string,
    componentId: string,
    payload: CreateComponentRequest<T>
  ): Promise<ComponentResponse<T>> => {
    try {
      const componentPayload = {
        ...payload,
        component_id:
          payload.component_id || `${payload.component_type}-${Date.now()}`,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/pages/${pageSlug}/components/replace/${componentId}/`,
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
        `Failed to replace component: ${error instanceof Error ? error.message : "Unknown error"}`
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
      // Limit concurrency to prevent overwhelming the server/browser
      const CONCURRENCY_LIMIT = 3;
      const results: Promise<void>[] = [];
      const executing: Promise<void>[] = [];

      for (const update of orderUpdates) {
        const p = fetch(
          `${API_BASE_URL}/api/pages/${pageSlug}/components/${update.componentId}/`,
          {
            method: "PATCH",
            headers: createHeaders(),
            body: JSON.stringify({ order: update.order }),
          }
        )
          .then(handleApiError)
          .then(() => {});

        results.push(p);

        const e: Promise<void> = p.then(() => {
          executing.splice(executing.indexOf(e), 1);
        });
        executing.push(e);

        if (executing.length >= CONCURRENCY_LIMIT) {
          await Promise.race(executing);
        }
      }

      await Promise.all(results);
    } catch (error) {
      throw new Error(
        `Failed to update component orders: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
