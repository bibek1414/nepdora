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
  onStyleSelect: (
    style: "portfolio-1" | "portfolio-2" | "portfolio-3" | "portfolio-4"
  ) => void;
}

export const PortfolioStylesDialog: React.FC<PortfolioStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "portfolio-1" | "portfolio-2" | "portfolio-3" | "portfolio-4" | null
  >(null);

  const templates = [
    {
      id: "portfolio-1" as const,
      name: "Portfolio Grid 1",
      description: "Classic grid layout with overlays",
    },
    {
      id: "portfolio-2" as const,
      name: "Portfolio Grid 2",
      description: "Compact grid with hover effects",
    },
    {
      id: "portfolio-3" as const,
      name: "Portfolio List",
      description: "Horizontal list layout with details",
    },
    {
      id: "portfolio-4" as const,
      name: "Portfolio Masonry",
      description: "Dynamic masonry layout for varied content",
    },
  ];

  const handleSelect = (template: {
    id: "portfolio-1" | "portfolio-2" | "portfolio-3" | "portfolio-4";
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
            Choose Portfolio Section Style
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <div key={template.id} className="flex flex-col">
              <div
                className={`group cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 hover:shadow-lg ${
                  selectedStyle === template.id
                    ? "border-blue-500 ring-2 ring-blue-500"
                    : "border-border hover:border-gray-300"
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
                  <div className="relative aspect-video w-full overflow-hidden rounded bg-gray-100">
                    <Image
                      src={`/images/site-owners/portfolio/portfolio${template.id.split("-")[1]}.png`}
                      alt={template.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 px-1">
                <h3 className="text-foreground font-semibold">
                  {template.name}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
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
