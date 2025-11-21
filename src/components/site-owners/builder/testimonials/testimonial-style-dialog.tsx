// testimonial-style-dialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type TestimonialStyleId =
  | "testimonial-1"
  | "testimonial-2"
  | "testimonial-3"
  | "testimonial-4"
  | "testimonial-5"
  | "testimonial-6"
  | "testimonial-7"
  | "testimonial-8";

interface TestimonialsStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: TestimonialStyleId) => void;
}

export const TestimonialsStylesDialog: React.FC<
  TestimonialsStylesDialogProps
> = ({ open, onOpenChange, onStyleSelect }) => {
  const [selectedStyle, setSelectedStyle] = useState<TestimonialStyleId | null>(
    null
  );

  const templates = [
    {
      id: "testimonial-1" as const,
      name: "Grid Style",
    },
    {
      id: "testimonial-2" as const,
      name: "Carousel Style",
    },
    {
      id: "testimonial-3" as const,
      name: "Card Style 3",
    },
    {
      id: "testimonial-4" as const,
      name: "Modern Cards",
    },
    {
      id: "testimonial-5" as const,
      name: "Slider Style 5",
    },
    {
      id: "testimonial-6" as const,
      name: "Stagger Layout",
    },
    {
      id: "testimonial-7" as const,
      name: "Minimal Cards",
    },
    {
      id: "testimonial-8" as const,
      name: "Premium Gradient",
    },
  ];

  const handleSelect = (template: { id: TestimonialStyleId }) => {
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
            Choose a Testimonials Style
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {templates.map((template, index) => (
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
                      src={`/images/site-owners/testimonials/testimonial${index + 1}.png`}
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
