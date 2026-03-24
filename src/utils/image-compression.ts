import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  onProgress?: (progress: number) => void;
}

export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxSizeMB = 0.5, // Default to 500KB
    maxWidthOrHeight = 1920,
    useWebWorker = true,
    onProgress,
  } = options;

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker,
    onProgress,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    // Return original file if compression fails as a fallback
    return file;
  }
};
