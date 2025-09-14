import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface PortfolioStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "portfolio-1" | "portfolio-2" | "portfolio-3") => void;
}

export const PortfolioStylesDialog: React.FC<PortfolioStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "portfolio-1" | "portfolio-2" | "portfolio-3" | null
  >(null);

  const templates = [
    {
      id: "portfolio-1" as const,
      name: "Portfolio Grid - Modern",
      description: "Modern grid layout with filters and hover effects",
    },
    {
      id: "portfolio-2" as const,
      name: "Portfolio List - Clean",
      description: "Clean list layout with detailed project information",
    },
    {
      id: "portfolio-3" as const,
      name: "Portfolio Masonry - Creative",
      description: "Creative masonry layout for showcasing diverse projects",
    },
  ];

  const handleSelect = (template: {
    id: "portfolio-1" | "portfolio-2" | "portfolio-3";
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
      <DialogContent className="h-auto max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose Portfolio Template
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-3">
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
                      src={`/images/site-owners/portfolio/portfolio${
                        template.id.split("-")[1]
                      }.png`}
                      alt={template.name}
                      width={300}
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
