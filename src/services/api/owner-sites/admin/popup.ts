import {
  PopUp,
  PopUpForm,
  PopupFormData,
  PopupFormFilters,
  PaginatedPopupFormResponse,
} from "@/types/owner-site/admin/popup";
import { getApiBaseUrl } from "@/config/site";

export const popupApi = {
  // Popup CRUD operations
  getPopups: async (): Promise<PopUp[]> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup/`);
    if (!response.ok) throw new Error("Failed to fetch popups");
    return response.json();
  },

  getPopup: async (id: number): Promise<PopUp> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch popup");
    return response.json();
  },

  createPopup: async (data: FormData): Promise<PopUp> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup/`, {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create popup");
    }
    return response.json();
  },

  updatePopup: async (id: number, data: FormData): Promise<PopUp> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup/${id}/`, {
      method: "PUT",
      body: data,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update popup");
    }
    return response.json();
  },

  deletePopup: async (id: number): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete popup");
  },

  // PopupForm operations with pagination
  getPopupForms: async (
    filters?: PopupFormFilters
  ): Promise<PaginatedPopupFormResponse> => {
    const API_BASE_URL = getApiBaseUrl();

    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size)
      params.append("page_size", filters.page_size.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.popup) params.append("popup", filters.popup.toString());

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/popup-form/${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch popup forms");
    return response.json();
  },

  getPopupForm: async (id: number): Promise<PopUpForm> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup-form/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch popup form");
    return response.json();
  },

  createPopupForm: async (data: PopUpForm): Promise<PopUpForm> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup-form/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to submit form");
    }
    return response.json();
  },

  updatePopupForm: async (id: number, data: PopUpForm): Promise<PopUpForm> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup-form/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update form");
    }
    return response.json();
  },

  deletePopupForm: async (id: number): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup-form/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete form");
  },

  getActivePopup: async (): Promise<PopUp | null> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup/?is_active=true`);
    if (!response.ok) throw new Error("Failed to fetch active popup");
    const data = await response.json();

    // Additional check to ensure the popup is actually active
    const activePopup = data.find((popup: PopUp) => popup.is_active === true);
    return activePopup || null;
  },

  // Submit form data from frontend
  submitForm: async (
    popupId: number,
    formData: PopupFormData
  ): Promise<{ success: boolean; message: string }> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/popup-form/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        popup: popupId,
        ...formData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to submit form");
    }

    return { success: true, message: "Form submitted successfully!" };
  },
};
