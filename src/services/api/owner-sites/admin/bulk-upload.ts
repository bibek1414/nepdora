import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { handleApiError } from "@/utils/api-error";
import { createHeaders } from "@/utils/headers";

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

    const response = await apiFetch(url, {
      method: "POST",
      body: formData,
    });

    await handleApiError(response);
    return response.json();
  },

  downloadTemplate: async () => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/download-template/`, {
      headers: createHeaders(),
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_bulk_upload_template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  },
};
