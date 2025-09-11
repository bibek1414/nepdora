"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface AboutUsStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    template: "about-1" | "about-2" | "about-3" | "about-4"
  ) => void;
}

export const AboutUsStylesDialog: React.FC<AboutUsStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "about-1" | "about-2" | "about-3" | "about-4" | null
  >(null);

  const templates = [
    {
      id: "about-1" as const,
      name: "Split Layout with Stats",
      preview: (
        <Image
          src="/images/site-owners/about/about1.png"
          alt="About Us 1"
          width={800}
          height={400}
          className="rounded-md"
        />
      ),
    },
    {
      id: "about-2" as const,
      name: "Team Showcase",
      preview: (
        <Image
          src="/images/site-owners/about/about2.png"
          alt="About Us 2"
          width={800}
          height={400}
          className="rounded-md"
        />
      ),
    },
    {
      id: "about-3" as const,
      name: "Modern Design",
      preview: (
        <Image
          src="/images/site-owners/about/about3.png"
          alt="About Us 3"
          width={800}
          height={400}
          className="rounded-md"
        />
      ),
    },
    {
      id: "about-4" as const,
      name: "Minimalist Image Right",
      preview: (
        <Image
          src="/images/site-owners/about/about4.png"
          alt="About Us 4"
          width={800}
          height={400}
          className="rounded-md"
        />
      ),
    },
  ];

  const handleSelect = (
    templateId: "about-1" | "about-2" | "about-3" | "about-4"
  ) => {
    setSelectedStyle(templateId);
    setTimeout(() => {
      onStyleSelect(templateId);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Choose About Us Template
            </h2>
            <p className="mt-1 text-gray-600">
              Select a template for your &quot;About Us&quot; section. Click a
              preview to add it.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className="group hover: relative cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-500"
              >
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {template.name}
                </h3>
                <div className="relative h-48 overflow-hidden rounded-lg border bg-gray-50">
                  {template.preview}
                </div>
                {selectedStyle === template.id && (
                  <Badge
                    variant="default"
                    className="absolute top-2 right-2 animate-pulse"
                  >
                    Adding...
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
