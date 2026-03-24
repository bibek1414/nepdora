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

export const uploadToS3 = async (
  file: File,
  folder: string = "nepdora"
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
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

export const deleteS3Folder = async (folder: string): Promise<void> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/s3/delete-folder/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    if (!response.ok) throw new Error("Failed to delete folder");
  } catch (error) {
    console.error("S3 delete folder error:", error);
    throw error;
  }
};
