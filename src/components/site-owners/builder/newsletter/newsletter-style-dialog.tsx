import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface NewsletterStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "style-1" | "style-2" | "style-3") => void;
}

export const NewsletterStylesDialog: React.FC<NewsletterStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "style-1" | "style-2" | "style-3" | null
  >(null);

  const templates = [
    {
      id: "style-1" as const,
      name: "Newsletter style 1",
      description: "Simple card-style newsletter signup",
    },
    {
      id: "style-2" as const,
      name: "Newsletter style 2",
      description: "Modern gradient with decorative elements",
    },
    {
      id: "style-3" as const,
      name: "Newsletter style 3",
      description: "Professional layout with statistics",
    },
  ];

  const handleSelect = (template: {
    id: "style-1" | "style-2" | "style-3";
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
            Choose a Newsletter Style
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
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
                      src={`/images/site-owners/newsletter/newsletter${
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
