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
  onStyleSelect: (
    template:
      | "about-1"
      | "about-2"
      | "about-3"
      | "about-4"
      | "about-5"
      | "about-6"
      | "about-7"
      | "about-8"
  ) => void;
}

export const AboutUsStylesDialog: React.FC<AboutUsStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    | "about-1"
    | "about-2"
    | "about-3"
    | "about-4"
    | "about-5"
    | "about-6"
    | "about-7"
    | "about-8"
    | null
  >(null);

  const templates = [
    { id: "about-1" as const, name: "Split Layout with Stats" },
    { id: "about-2" as const, name: "Minimalist Image Left" },
    { id: "about-3" as const, name: "Modern Design" },
    { id: "about-4" as const, name: "Minimalist Image Right" },
    { id: "about-5" as const, name: "Better Design" },
    { id: "about-6" as const, name: "Creative Layout" },
    { id: "about-7" as const, name: "Training Focused" },
    { id: "about-8" as const, name: "Technical Specifications" },
  ];

  const handleSelect = (
    templateId:
      | "about-1"
      | "about-2"
      | "about-3"
      | "about-4"
      | "about-5"
      | "about-6"
      | "about-7"
      | "about-8"
  ) => {
    setSelectedStyle(templateId);
    setTimeout(() => {
      onStyleSelect(templateId);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Slide-in right panel */}
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-l bg-white p-6 shadow-xl transition-all duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose About Us Template
          </DialogTitle>
        </DialogHeader>

        {/* Single-column layout */}
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
                onClick={() => handleSelect(template.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ")
                    handleSelect(template.id);
                }}
              >
                <div className="p-3">
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
