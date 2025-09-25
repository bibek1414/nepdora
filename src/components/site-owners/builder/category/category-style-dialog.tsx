import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface CategoryStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    style: "grid-1" | "grid-2" | "grid-3" | "link-1" | "card-1"
  ) => void;
}

export const CategoryStylesDialog: React.FC<CategoryStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "grid-1" | "grid-2" | "grid-3" | "link-1" | "card-1" | null
  >(null);

  const templates = [
    {
      id: "grid-1" as const,
      name: "Grid Style 1",
    },
    {
      id: "grid-2" as const,
      name: "Grid Style 2",
    },
    {
      id: "grid-3" as const,
      name: "Grid Style 3",
    },
    {
      id: "link-1" as const,
      name: "Link Style 1",
    },
    {
      id: "card-1" as const,
      name: "Card Style 1",
    },
  ];

  const handleSelect = (template: {
    id: "grid-1" | "grid-2" | "grid-3" | "link-1" | "card-1";
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
      <DialogContent className="h-auto max-w-7xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose Category Section Style
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4 md:grid-cols-3 lg:grid-cols-3">
          {templates.map((template, index) => (
            <div key={template.id} className="flex flex-col items-center">
              <div
                className={`group cursor-pointer border transition-all duration-200 hover:shadow-md ${
                  selectedStyle === template.id
                    ? "border-blue-200 ring-2 ring-blue-500"
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
                      src={`/images/site-owners/categories/category${index + 1}.png`}
                      alt={template.name}
                      width={400}
                      height={300}
                      className="h-auto w-full rounded"
                    />
                  </div>
                </div>
              </div>

              <h3 className="mt-2 text-center text-sm font-medium text-gray-600">
                {template.name}
              </h3>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
