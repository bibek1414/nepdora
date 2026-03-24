export const DEFAULT_MAX_IMAGE_SIZE = 500 * 1024; // 500kb
import { siteConfig } from "@/config/site";
import { apiFetch } from "@/lib/api-client";
const API_BASE_URL = siteConfig.apiBaseUrl;
export interface S3File {
  name: string;
  url: string;
  size: number;
  last_modified: string;
}

import { compressImage } from "./image-compression";

export const uploadToS3 = async (
  file: File,
  folder: string = "nepdora"
): Promise<string> => {
  try {
    let fileToUpload = file;

    // Compress image if it's larger than 500KB and it's an image
    if (file.size > DEFAULT_MAX_IMAGE_SIZE && file.type.startsWith("image/")) {
      const originalSizeKB = (file.size / 1024).toFixed(2);
      console.log(`[Compression] Starting: ${file.name} (${originalSizeKB} KB)`);
      
      fileToUpload = await compressImage(file, {
        maxSizeMB: DEFAULT_MAX_IMAGE_SIZE / (1024 * 1024), // Convert to MB
        useWebWorker: true,
      });

      const compressedSizeKB = (fileToUpload.size / 1024).toFixed(2);
      const reduction = (((file.size - fileToUpload.size) / file.size) * 100).toFixed(1);
      console.log(`[Compression] Finished: ${fileToUpload.name} (${compressedSizeKB} KB) - Reduced by ${reduction}%`);
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("folder", folder);

    const response = await apiFetch(`${API_BASE_URL}/api/s3/upload/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "S3 upload failed");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
};

export const listS3Files = async (
  folder: string = "nepdora"
): Promise<S3File[]> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/s3/files/`);
    if (!response.ok) throw new Error("Failed to list files");
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("S3 list error:", error);
    return [];
  }
};

export const deleteS3Files = async (urls: string[]): Promise<void> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/s3/delete/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    });
    if (!response.ok) throw new Error("Failed to delete file(s)");
  } catch (error) {
    console.error("S3 delete error:", error);
    throw error;
  }
};
