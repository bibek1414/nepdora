import { getApiBaseUrl } from "@/config/site";
import { handleApiError } from "@/utils/api-error";

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  total_processed?: number;
  successful?: number;
  failed?: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}

export interface DownloadTemplateResponse {
  success: boolean;
  file_url?: string;
}

export const bulkUploadApi = {
  // Bulk upload products via CSV
  bulkUpload: async (file: File): Promise<BulkUploadResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const url = `${API_BASE_URL}/api/bulk-upload/`;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  // Download CSV template
  downloadTemplate: async (): Promise<Blob> => {
    const API_BASE_URL = getApiBaseUrl();
    const url = `${API_BASE_URL}/api/download-template/`;

    const token = localStorage.getItem("authToken");

    const response = await fetch(url, {
      method: "GET",
    });

    await handleApiError(response);
    return response.blob();
  },
};
