"use client";

import React, { useState } from "react";
import { ImagePlus } from "lucide-react";
import { MediaLibraryDialog } from "@/components/ui/media-library-dialog";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface ImageEditOverlayProps {
  onImageSelect: (url: string) => void;
  imageWidth: number;
  imageHeight: number;
  isEditable?: boolean;
  label?: string;
  folder?: string;
  className?: string; // For custom positioning
}

export const ImageEditOverlay: React.FC<ImageEditOverlayProps> = ({
  onImageSelect,
  imageWidth,
  imageHeight,
  isEditable = false,
  label = "Change Image",
  folder = "uploads",
  className = "absolute top-6 right-6 z-30",
}) => {
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
    },
  };

  if (!isEditable) return null;

  return (
    <>
      <div
        className={`${className} cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 animate-in fade-in duration-200`}
        onClick={(e) => {
          e.stopPropagation();
          setIsMediaDialogOpen(true);
        }}
      >
        <div className="flex flex-col items-center rounded-md px-2 py-2">
          <span
            style={{
              background: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
            className="mb-1 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <ImagePlus className="h-4 w-4" />
            {label}
          </span>
          <span className="mt-0.5 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-800 shadow-sm backdrop-blur-sm border border-gray-100">
            Size: {imageWidth} × {imageHeight}px
          </span>
        </div>
      </div>
      <MediaLibraryDialog
        open={isMediaDialogOpen}
        onOpenChange={setIsMediaDialogOpen}
        onSelect={onSelectUrl => {
          onImageSelect(onSelectUrl);
          setIsMediaDialogOpen(false);
        }}
        folder={folder}
      />
    </>
  );
};
