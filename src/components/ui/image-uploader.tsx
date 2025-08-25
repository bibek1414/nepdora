"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: File[] | string[] | null | undefined;
  onChange: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  disabled,
  multiple = false,
}) => {
  const [previews, setPreviews] = useState<string[]>(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map(v =>
        typeof v === "string" ? v : URL.createObjectURL(v)
      );
    }
    return [];
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = multiple ? acceptedFiles : [acceptedFiles[0]];
      onChange(files);

      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    },
    [onChange, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
    disabled,
  });

  const handleRemove = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    // Update files
    const newFiles = Array.isArray(value) ? [...value] : [];
    newFiles.splice(index, 1);
    onChange(newFiles as File[]);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-muted-foreground/30 relative cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : ""
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-10 w-10" />
          <p className="text-sm">
            {isDragActive
              ? "Drop the files here..."
              : `Drag & drop ${multiple ? "images" : "an image"} here, or click to select`}
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
                className="h-24 w-24 rounded-md object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove(index)}
                  className="bg-destructive/80 text-destructive-foreground hover:bg-destructive absolute -top-2 -right-2 rounded-full p-1.5 transition-colors"
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
