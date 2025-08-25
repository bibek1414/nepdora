"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploaderProps {
  value: File[] | string[] | File | string | null | undefined;
  onChange: (files: File[] | File | null) => void;
  disabled?: boolean;
  multiple?: boolean;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  disabled = false,
  multiple = false,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = multiple ? 10 : 1,
}) => {
  const [previews, setPreviews] = useState<{ url: string; isFile: boolean }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  // Initialize previews from existing value
  useEffect(() => {
    if (!value) {
      setPreviews([]);
      setCurrentFiles([]);
      return;
    }

    const initializePreviews = () => {
      if (Array.isArray(value)) {
        const newPreviews = value.map(v => ({
          url: typeof v === "string" ? v : URL.createObjectURL(v),
          isFile: typeof v !== "string",
        }));
        const files = value.filter(v => typeof v !== "string") as File[];
        setPreviews(newPreviews);
        setCurrentFiles(files);
      } else if (value) {
        const preview = {
          url: typeof value === "string" ? value : URL.createObjectURL(value),
          isFile: typeof value !== "string",
        };
        setPreviews([preview]);
        setCurrentFiles(typeof value === "string" ? [] : [value]);
      }
    };

    initializePreviews();

    // Cleanup function
    return () => {
      previews.forEach(preview => {
        if (preview.isFile && preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [value]);

  const validateFiles = (
    files: File[]
  ): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file, index) => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(
          `File ${file.name} is too large. Max size: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`
        );
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        errors.push(`File ${file.name} is not a valid image`);
        return;
      }

      validFiles.push(file);
    });

    // Check total file count
    const totalFiles = currentFiles.length + validFiles.length;
    if (totalFiles > maxFiles) {
      const allowedCount = maxFiles - currentFiles.length;
      errors.push(
        `Too many files. You can only upload ${allowedCount} more file(s)`
      );
      return { validFiles: validFiles.slice(0, allowedCount), errors };
    }

    return { validFiles, errors };
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        setError("No valid files selected");
        return;
      }

      const { validFiles, errors } = validateFiles(acceptedFiles);

      if (errors.length > 0) {
        setError(errors.join(", "));
        if (validFiles.length === 0) return;
      }

      let newFiles: File[];
      if (multiple) {
        newFiles = [...currentFiles, ...validFiles];
      } else {
        // Single file mode - replace existing
        newFiles = validFiles.slice(0, 1);
      }

      setCurrentFiles(newFiles);

      // Create new previews for added files
      const newPreviews = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        isFile: true,
      }));

      if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews]);
        onChange(newFiles);
      } else {
        // Clean up old preview URLs
        previews.forEach(preview => {
          if (preview.isFile && preview.url.startsWith("blob:")) {
            URL.revokeObjectURL(preview.url);
          }
        });
        setPreviews(newPreviews);
        onChange(newFiles[0] || null);
      }
    },
    [currentFiles, multiple, onChange, previews, maxFileSize, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    multiple,
    disabled,
    maxSize: maxFileSize,
  });

  const handleRemove = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();

    // Clean up blob URL if it's a file
    const previewToRemove = previews[index];
    if (previewToRemove?.isFile && previewToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(previewToRemove.url);
    }

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    const newFiles = [...currentFiles];
    // Find the corresponding file to remove
    const fileIndex = newFiles.findIndex((_, i) => i === index);
    if (fileIndex >= 0) {
      newFiles.splice(fileIndex, 1);
    }
    setCurrentFiles(newFiles);

    if (multiple) {
      onChange(newFiles);
    } else {
      onChange(newFiles[0] || null);
    }

    // Clear error if files are now valid
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-muted-foreground/30 relative cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : ""
        } ${disabled ? "cursor-not-allowed opacity-50" : ""} ${
          error ? "border-destructive/50" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-10 w-10" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop the files here..."
              : `Drag & drop ${multiple ? "images" : "an image"} here, or click to select`}
          </p>
          <p className="text-muted-foreground text-xs">
            Max file size: {formatFileSize(maxFileSize)} • Supported: JPG, PNG,
            WebP, GIF
            {multiple && ` • Max files: ${maxFiles}`}
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div
          className={`grid gap-4 ${multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "mx-auto max-w-xs grid-cols-1"}`}
        >
          {previews.map((preview, index) => (
            <div key={`${preview.url}-${index}`} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove(index)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1.5 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
