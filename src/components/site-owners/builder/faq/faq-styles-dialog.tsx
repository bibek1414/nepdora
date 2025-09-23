import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface FAQStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    style: "accordion" | "plus-minus" | "card-grid" | "card-grid-4"
  ) => void; // Updated to use string values
}

export const FAQStylesDialog: React.FC<FAQStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  // Updated templates to use the correct style strings that match your switch statement
  const templates = [
    { id: 1, name: "Accordion Style", style: "accordion" as const },
    { id: 2, name: "Plus/Minus Style", style: "plus-minus" as const },
    { id: 3, name: "Card Grid Style", style: "card-grid" as const },
    { id: 4, name: "Card Grid Style 4", style: "card-grid-4" as const },
  ];

  const handleSelect = (template: {
    id: number;
    style: "accordion" | "plus-minus" | "card-grid" | "card-grid-4";
  }) => {
    setSelectedStyle(template.style);
    setTimeout(() => {
      onStyleSelect(template.style); // Now passing the correct string value
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-w-7xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose a FAQ Style
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4 md:grid-cols-3 lg:grid-cols-3">
          {templates.map(template => (
            <div key={template.id} className="flex flex-col items-center">
              <div
                className={`group cursor-pointer border transition-all duration-200 hover:shadow-md ${
                  selectedStyle === template.style
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
                      src={`/images/site-owners/faq/faq-${template.id}.png`}
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
