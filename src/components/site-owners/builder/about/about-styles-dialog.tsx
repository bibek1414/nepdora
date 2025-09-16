"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface AboutUsStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (template: "about-1" | "about-3" | "about-4") => void;
}

export const AboutUsStylesDialog: React.FC<AboutUsStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "about-1" | "about-3" | "about-4" | null
  >(null);

  const templates = [
    {
      id: "about-1" as const,
      name: "Split Layout with Stats",
    },
    {
      id: "about-3" as const,
      name: "Modern Design",
    },
    {
      id: "about-4" as const,
      name: "Minimalist Image Right",
    },
  ];

  const handleSelect = (templateId: "about-1" | "about-3" | "about-4") => {
    setSelectedStyle(templateId);
    setTimeout(() => {
      onStyleSelect(templateId);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-w-7xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose About Us Template
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4 md:grid-cols-3 lg:grid-cols-2">
          {templates.map(template => (
            <div key={template.id} className="flex flex-col items-center">
              <div
                className={`group cursor-pointer border transition-all duration-200 hover:shadow-md ${
                  selectedStyle === template.id
                    ? "border-blue-200 ring-2 ring-blue-500"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleSelect(template.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ")
                    handleSelect(template.id);
                }}
              >
                <div className="p-3">
                  <div className="relative w-full">
                    <Image
                      src={`/images/site-owners/about/about${
                        template.id.split("-")[1]
                      }.png`}
                      alt={template.name}
                      width={600}
                      height={400}
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
