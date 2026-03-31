import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { handleApiError } from "@/utils/api-error";
import { createHeaders, createHeadersTokenOnly } from "@/utils/headers";

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
  // Bulk upload products via CSV/Excel and optional ZIP for images
  bulkUpload: async (
    file: File,
    zipFile?: File
  ): Promise<BulkUploadResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const url = `${API_BASE_URL}/api/bulk-upload/`;

    const formData = new FormData();
    formData.append("file", file);
    if (zipFile) {
      formData.append("zip_file", zipFile);
    }

    const response = await apiFetch(url, {
      method: "POST",
      body: formData,
      headers: createHeadersTokenOnly(),
    });

    await handleApiError(response);
    return response.json();
  },

  downloadTemplate: async (): Promise<Blob> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await apiFetch(`${API_BASE_URL}/api/download-template/`, {
      headers: createHeaders(),
    });

    await handleApiError(response);
    return await response.blob();
  },
};
