import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface HeroStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    template:
      | "hero-1"
      | "hero-2"
      | "hero-3"
      | "hero-4"
      | "hero-5"
      | "hero-6"
      | "hero-7"
      | "hero-8"
      | "hero-9"
  ) => void;
}

export const HeroStylesDialog: React.FC<HeroStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    | "hero-1"
    | "hero-2"
    | "hero-3"
    | "hero-4"
    | "hero-5"
    | "hero-6"
    | "hero-7"
    | "hero-8"
    | "hero-9"
    | null
  >(null);

  const templates = [
    {
      id: "hero-1" as const,
      name: "Hero Template 1",
    },
    {
      id: "hero-2" as const,
      name: "Hero Template 2",
    },
    {
      id: "hero-3" as const,
      name: "Hero Template 3",
    },
    {
      id: "hero-4" as const,
      name: "Hero Template 4",
    },
    {
      id: "hero-5" as const,
      name: "Hero Template 5",
    },
    {
      id: "hero-6" as const,
      name: "Hero Template 6",
    },
    {
      id: "hero-7" as const,
      name: "Hero Template 7",
    },
    {
      id: "hero-8" as const,
      name: "Hero Template 8",
    },
    {
      id: "hero-9" as const,
      name: "Hero Template 9",
    },
  ];

  const handleSelect = (template: {
    id:
      | "hero-1"
      | "hero-2"
      | "hero-3"
      | "hero-4"
      | "hero-5"
      | "hero-6"
      | "hero-8"
      | "hero-9"
      | "hero-7";
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
            Choose Hero Template
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
                      src={`/images/site-owners/hero/hero${
                        template.id.split("-")[1]
                      }.png`}
                      alt={template.name}
                      width={600}
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
