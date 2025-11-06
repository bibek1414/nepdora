import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  ComponentTypeMap,
  ComponentResponse,
  CreateComponentRequest,
  UpdateComponentRequest,
} from "@/types/owner-site/components/components";
import { siteConfig } from "@/config/site";

const API_BASE_URL = siteConfig.apiBaseUrl;

export interface OrderUpdate {
  componentId: string;
  order: number;
}

export interface BulkOrderUpdateRequest {
  orderUpdates: OrderUpdate[];
}

export const componentsApi = {
  // Get all components for a page
  getPageComponents: async <
    T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
  >(
    pageSlug: string,
    templateSlug: string
  ): Promise<ComponentResponse<T>[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/template-pages/${templateSlug}/${pageSlug}/components/`,
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
    pageSlug: string,
    templateSlug: string
  ): Promise<ComponentResponse<T>[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/template-pages/${templateSlug}/${pageSlug}/components/`,
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
    templateSlug: string,
    payload: CreateComponentRequest<T>,
    existingComponents?: ComponentResponse[] // Add this parameter to pass current components
  ): Promise<ComponentResponse<T>> => {
    try {
      // Calculate next order if not provided
      let order = payload.order;
      if (order === undefined || order === 0) {
        if (existingComponents && existingComponents.length > 0) {
          const maxOrder = Math.max(
            ...existingComponents.map(c => c.order || 0)
          );
          order = maxOrder + 1;
        } else {
          order = 0; // First component starts at 0
        }
      }

      const componentPayload = {
        component_id:
          payload.component_id || `${payload.component_type}-${Date.now()}`,
        component_type: payload.component_type,
        data: payload.data,
        order,
        page: pageSlug,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/template-pages/${templateSlug}/${pageSlug}/components/`,
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
    templateSlug: string,
    payload: UpdateComponentRequest<T>,
    componentType: T
  ): Promise<ComponentResponse<T>> => {
    try {
      const updatePayload = {
        component_type: componentType,
        data: payload.data,
        ...(payload.order !== undefined && { order: payload.order }),
        page: pageSlug,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/template-pages/${templateSlug}/${pageSlug}/components/${componentId}/`,
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
    templateSlug: string,
    componentType: keyof ComponentTypeMap
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/template-pages/${templateSlug}/${pageSlug}/components/${componentId}/`,
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
    componentType: T,
    templateSlug: string
  ): Promise<ComponentResponse<T>[]> => {
    const allComponents = await componentsApi.getPageComponents(
      pageSlug,
      templateSlug
    );
    return allComponents.filter(
      (component): component is ComponentResponse<T> =>
        component.component_type === componentType
    );
  },

  // Get single component by id
  getComponent: async <T extends keyof ComponentTypeMap>(
    pageSlug: string,
    componentId: string,
    templateSlug: string
  ): Promise<ComponentResponse<T> | null> => {
    const allComponents = await componentsApi.getPageComponents(
      pageSlug,
      templateSlug
    );
    return (
      (allComponents.find(
        component => component.component_id === componentId
      ) as ComponentResponse<T>) || null
    );
  },
};

// Specific component type APIs that use the generic service
export const portfolioComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "portfolio", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["portfolio"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "portfolio",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["portfolio"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "portfolio"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "portfolio"
    ),
};

export const heroComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "hero", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["hero"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "hero",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["hero"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "hero"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, templateSlug, "hero"),
};

export const bannerComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "banner", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["banner"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "banner",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["banner"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "banner"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "banner"
    ),
};

export const faqComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "faq", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["faq"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "faq",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["faq"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "faq"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, templateSlug, "faq"),
};

export const testimonialsComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "testimonials", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["testimonials"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "testimonials",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["testimonials"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "testimonials"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "testimonials"
    ),
};

export const aboutComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "about", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["about"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "about",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["about"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "about"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, templateSlug, "about"),
};

export const blogComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "blog", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["blog"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "blog",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["blog"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "blog"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, templateSlug, "blog"),
};

export const productComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "products", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["products"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "products",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["products"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "products"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "products"
    ),
};

// Category component APIs
export const categoryComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "category", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["category"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "category",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["category"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "category"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "category"
    ),
};

// SubCategory component APIs
export const subCategoryComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "subcategory", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["subcategory"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "subcategory",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["subcategory"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "subcategory"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "subcategory"
    ),
};

export const teamComponentsApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "team", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["team"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "team",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["team"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "team"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(pageSlug, componentId, templateSlug, "team"),
};

export const componentOrdersApi = {
  updateComponentOrders: async (
    pageSlug: string,
    templateSlug: string,
    orderUpdates: OrderUpdate[]
  ): Promise<void> => {
    try {
      // Process updates sequentially to avoid conflicts
      for (const { componentId, order } of orderUpdates) {
        const response = await fetch(
          `${API_BASE_URL}/api/template-pages/${templateSlug}/${pageSlug}/components/${componentId}/`,
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
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "newsletter", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["newsletter"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "newsletter",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["newsletter"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "newsletter"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "newsletter"
    ),
};

export const youtubeComponentApi = {
  getAll: (pageSlug: string, templateSlug: string) =>
    componentsApi.getComponentsByType(pageSlug, "youtube", templateSlug),
  create: (
    pageSlug: string,
    templateSlug: string,
    data: ComponentTypeMap["youtube"]
  ) =>
    componentsApi.createComponent(pageSlug, templateSlug, {
      component_type: "youtube",
      data,
    }),
  update: (
    pageSlug: string,
    componentId: string,
    templateSlug: string,
    data: Partial<ComponentTypeMap["youtube"]>
  ) =>
    componentsApi.updateComponent(
      pageSlug,
      componentId,
      templateSlug,
      { data },
      "youtube"
    ),
  delete: (pageSlug: string, componentId: string, templateSlug: string) =>
    componentsApi.deleteComponent(
      pageSlug,
      componentId,
      templateSlug,
      "youtube"
    ),
};
