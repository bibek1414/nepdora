export const DEFAULT_MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const uploadToS3 = async (
  file: File,
  folder: string = "nepdora"
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload/s3", {
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

export const getS3Url = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  
  const customDomain = process.env.NEXT_PUBLIC_AWS_S3_CUSTOM_DOMAIN || "himalayancrm.sgp1.digitaloceanspaces.com";
  
  // Format: https://custom-domain/path
  return `https://${customDomain}/${path}`;
};
