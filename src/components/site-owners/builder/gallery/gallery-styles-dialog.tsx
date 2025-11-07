import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface GalleryStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    template:
      | "gallery-1"
      | "gallery-2"
      | "gallery-3"
      | "gallery-4"
      | "gallery-5"
  ) => void;
}

export const GalleryStylesDialog: React.FC<GalleryStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "gallery-1" | "gallery-2" | "gallery-3" | "gallery-4" | "gallery-5" | null
  >(null);

  const templates = [
    {
      id: "gallery-1" as const,
      name: "Grid 4 Columns",
      description: "Classic grid layout with 4 columns and hover effects",
    },
    {
      id: "gallery-2" as const,
      name: "Masonry Layout",
      description: "Pinterest-style masonry grid with varied heights",
    },
    {
      id: "gallery-3" as const,
      name: "3D Gallery",
      description: "3D gallery layout with hover effects",
    },
    {
      id: "gallery-4" as const,
      name: "Our Latest Creations",
      description:
        "A visual collection of our most recent works - each piece crafted with intention, emotion, and style.",
    },
    {
      id: "gallery-5" as const,
      name: "Grid 5 Columns",
      description:
        "A visual collection of our most recent works - each piece crafted with intention, emotion, and style.",
    },
  ];

  const handleSelect = (template: {
    id: "gallery-1" | "gallery-2" | "gallery-3" | "gallery-4" | "gallery-5";
  }) => {
    setSelectedStyle(template.id);
    setTimeout(() => {
      onStyleSelect(template.id);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-r bg-white p-6 shadow-xl transition-all duration-300 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose Gallery Template
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="flex flex-col items-center justify-center"
            >
              <div
                className={`group w-full cursor-pointer border transition-all duration-200 hover:shadow-md ${
                  selectedStyle === template.id
                    ? "border-blue-300 ring-2 ring-blue-500"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleSelect(template)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ")
                    handleSelect(template);
                }}
              >
                <div className="p-3">
                  <div className="relative w-full">
                    <Image
                      src={`/images/site-owners/gallery/gallery${
                        template.id.split("-")[1]
                      }.png`}
                      alt={template.name}
                      width={400}
                      height={300}
                      className="h-auto w-full rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
