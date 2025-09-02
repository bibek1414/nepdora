"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, AlertCircle, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
        <Alert variant="destructive" className="border-destructive/20 border">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`group border-border bg-muted/20 hover:bg-muted/30 relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : ""
        } ${disabled ? "cursor-not-allowed opacity-50" : ""} ${
          error ? "border-destructive/50 bg-destructive/5" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className={`rounded-full p-3 transition-colors ${
              isDragActive ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <UploadCloud
              className={`h-8 w-8 ${
                isDragActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
          <div className="space-y-1">
            <p className="text-foreground text-sm font-medium">
              {isDragActive
                ? "Drop the files here..."
                : `Click to upload ${multiple ? "images" : "an image"} or drag and drop`}
            </p>
            <p className="text-muted-foreground text-xs">
              Max {formatFileSize(maxFileSize)} • JPG, PNG, WebP, GIF
              {multiple && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <p className="text-foreground text-sm font-medium">
            {multiple ? "Uploaded Images" : "Uploaded Image"} ({previews.length}
            )
          </p>
          <div
            className={`grid gap-3 ${
              multiple
                ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
                : "max-w-[120px] grid-cols-1"
            }`}
          >
            {previews.map((preview, index) => (
              <div key={`${preview.url}-${index}`} className="group relative">
                <div className="border-border bg-muted relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes={multiple ? "120px" : "120px"}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove(index)}
                    className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full p-0 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 hover:scale-110"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
