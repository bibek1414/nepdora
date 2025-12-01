// banner-styles-dialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface BannerStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    template: "banner-1" | "banner-2" | "banner-3" | "banner-4" | "banner-5"
  ) => void;
}

export const BannerStylesDialog: React.FC<BannerStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "banner-1" | "banner-2" | "banner-3" | "banner-4" | "banner-5" | null
  >(null);

  const templates = [
    {
      id: "banner-1" as const,
      name: "Top Banner",
      description: "Full-width top banner with click-through functionality",
    },
    {
      id: "banner-2" as const,
      name: "Image Slider",
      description: "Auto-sliding image carousel with navigation controls",
    },
    {
      id: "banner-3" as const,
      name: "Three Column",
      description: "Three column banner with navigation controls",
    },
    {
      id: "banner-4" as const,
      name: "Four Column",
      description: "Four column banner with navigation controls",
    },
    {
      id: "banner-5" as const,
      name: "Five Column",
      description: "Five column banner with navigation controls",
    },
  ];

  const handleSelect = (template: {
    id: "banner-1" | "banner-2" | "banner-3" | "banner-4" | "banner-5";
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
            Choose Banner Template
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
                      src={`/images/site-owners/banner/banner${
                        template.id.split("-")[1]
                      }.png`}
                      alt={template.name}
                      width={400}
                      height={200}
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
